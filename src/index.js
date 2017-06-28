import querystring from 'querystring';
import request from 'request';
import cheerio from 'cheerio';
import queryMap from './queryMap.json';

export const recordTypes = queryMap.recordType;

export function sendInitialQuery(params, callback) {
  if (!params.alisEndpoint) {
    return process.nextTick(callback, new Error('alisEndpoint is not provided'));
  }
  if (!params.query) {
    return process.nextTick(callback, new Error('query is not provided'));
  }
  if (!params.queryType) {
    return process.nextTick(callback, new Error('queryType is not provided'));
  }
  if (!params.recordType) {
    return process.nextTick(callback, new Error('recordType is not provided'));
  }
  const j = request.jar();
  const alisEndpoint = `${params.alisEndpoint}`;
  const qs = querystring.stringify({
    radiodate: 'simple',
    valueINP: encodeURIComponent(params.query),
    tema: queryMap.recordType[params.recordType],
    tag: queryMap.queryType[params.queryType],
  });
  const firstPageUrl = `/alis/EK/do_searh.php?${qs}`;
  const INITIAL_URL = `${alisEndpoint}${firstPageUrl}`;

  request({ url: INITIAL_URL, jar: j }, (err, response, body) => {
    if (err) {
      return callback(err);
    }
    callback(null, { page: body, jar: j });
  });
}

export function getPage(options, callback) {
  request({ url: options.url, jar: options.jar }, (err, response, body) => {
    if (err) {
      return callback(err);
    }
    callback(null, body);
  });
}

export function getNextPageUrl($) {
  const pageLink = $('#Agt');
  const pageUrl = $(pageLink).attr('href');
  return pageUrl;
}

export function getTotal($) {
  const total = $('.listbzstat').first().text().match(/\d+(?=\sзап\.)/)[0];
  return total;
}

export function getItems($) {
  const items = $('.article').map(function (i, el) {
    return {
      id: $(el).attr('id'),
      title: $(el).text().trim(),
    };
  }).toArray();
  return items;
}

export function getNumberedPageUrls($) {
  const pageLinks = $('a[href^=\'do_other\']');
  const relativePageUrls = $(pageLinks).map((i, link) => $(link).attr('href').replace(/\r|\n/g, '')).toArray();
  return relativePageUrls;
}

export function parsePage(body) {
  const $ = cheerio.load(body);
  return $;
}

export function processItems(memo, q, options, callback) {
  if (!options) {
    return process.nextTick(callback, new Error('options is not provided'));
  }

  getPage({ url: options.url, jar: options.jar }, (err, body) => {
    if (err) return callback(err);
    const $ = parsePage(body);

    const items = getItems($);

    const nextPageUrl = getNextPageUrl($);
    const remainingQueue = q.slice(1);
    if (q.length === 1) {
      remainingQueue.push(`${nextPageUrl}`);
    }
    items.forEach((item) => {
      memo.push(item);
    });
    callback(null, memo, remainingQueue);
  });
}

export function run(fn, q, memo, options, callback) {
  if (!q) {
    return new Error('q is not provided');
  }

  if (q[0] === 'undefined') {
    return callback(null, memo);
  }
  fn(memo, q, { url: `${options.alisEndpoint}/alis/EK/${q[0]}`, jar: options.jar }, (err, nextMemo, nextQ) => {
    if (err) {
      return callback(err);
    }
    run(fn, nextQ, memo, options, callback);
  });
}

export function getRecordsByQuery(initParams, callback) {
  sendInitialQuery(initParams, (err, res) => {
    if (err) {
      return callback(err);
    }
    const options = {
      alisEndpoint: initParams.alisEndpoint,
      jar: res.jar,
    };
    if (res.page.match('Не результативный поиск')) {
      return callback(new Error('no match'));
    }
    const $ = parsePage(res.page);
    const firstNumberedPageUrls = getNumberedPageUrls($);
    const remainingQueue = firstNumberedPageUrls;
    run(processItems, remainingQueue, [], options, (runErr, memo) => {
      if (err) {
        return callback(err);
      }
      callback(null, memo);
    });
  });
}

export function collectReferences(table) {
  const title = table.children().toArray()[0].children[0].children[0].data;
  if (title !== 'Ссылки на др. биб.записи') {
    return [];
  }
  let references = [];
  const data = table.children().toArray();
  data.shift();
  data.forEach((el) => {
    const a = el.children[0].children[0];
    references.push({
      tag: a.attribs.onclick.match(/[0-9]+/)[0],
      value: a.children[0].data,
    });
  });
  return references;
}

export function collectFund(data) {
  const fund = {};
  for (let i = 0; i < data[0].length; i += 1) {
    if (data[0][i].match('фондир')) {
      fund[data[0][i]] = data[1][i];
    }
  }
  return fund;
}

export function getRecordInfo($) {
  const info = {};
  const firstTable = $('table').first().parsetable(false, false, true);
  for (let i = 0; i < firstTable[0].length; i++) {
    if (firstTable[0][i] !== '') {
      if (firstTable[0][i] === 'ISBN') {
        info[firstTable[0][i]] = firstTable[1][i].split(', ');
      } else info[firstTable[0][i]] = firstTable[1][i];
    }
  }
  const secondTable = $('table').first().next('table');
  if (secondTable) {
    const second = secondTable.parsetable(false, false, true);
    if (second[0][0] === 'Фонд') {
      info['Фонд'] = collectFund(second);
    } else {
      info.tags = collectReferences(second);
    }
  }

  const thirdTable = $('table').first().next('table').next('table');
  if (thirdTable) {
    info.tags = collectReferences(thirdTable);
  }
  delete info['Название'];
  return info;
}

export function getRecordByID(alisEndpoint, id, callback) {
  const firstPageUrl = `/alis/EK/do_view.php?id=${id}`;
  const INITIAL_URL = `${alisEndpoint}${firstPageUrl}`;
  getPage({ url: INITIAL_URL }, (err, body) => {
    if (err) return callback(err);
    if (body.match('Undefined variable')) return callback(new Error('Record not found'))
    const $ = parsePage(body);
    const info = getRecordInfo($);
    info.id = id;
    return callback(null, info);
  });
}
