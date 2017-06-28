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
  const references = [];
  const data = table.children().toArray();
  data.shift();
  data.forEach((el) => {
    const a = el.children[0].children[0];
    references.push({
      tag: Number(a.attribs.onclick.match(/[0-9]+/)[0]),
      value: a.children[0].data,
    });
  });
  return references;
}

export function collectFunds(table) {
  const funds = [];
  const data = table.children().toArray();
  data.shift();
  data.forEach((el) => {
    funds.push({
      name: el.children[0].children[0].children[0].data,
      count: Number(el.children[1].children[0].data),
    });
  });
  return funds;
}

export function collectFields(table) {
  const fields = [];
  const data = table.children().toArray();
  data.shift();
  data.forEach((el) => {
    fields.push({
      tag: el.children[0].children[0].children[0].data,
      value: el.children[1].children[0].data,
    });
  });
  return fields;
}

export function collectYears(table) {
  const references = [];
  const data = table.children().toArray();
  data.shift();
  data.forEach((el) => {
    const a = el.children[0].children[0];
    references.push(Number(a.children[0].data.substr(0, 4)));
  });
  return references;
}

export function getRecordInfo($) {
  const info = {};
  info.belmarcId = $('span')[0].children[0].data.substr(4);

  $('table').each((i, table) => {
    const $table = $(table);
    const title = $('tr:nth-child(1) th:nth-child(1)', table).text();

    switch (title) {
      case 'Год(комплект)':
        info.years = collectYears($table);
        break;
      case 'Ссылки на др. биб.записи':
        info.references = collectReferences($table);
        break;
      case 'Название':
        info.fields = collectFields($table);
        break;
      case 'Фонд':
        info.funds = collectFunds($table);
        break;
      default:

    }
  });

  return info;
}

export function getRecordByID(alisEndpoint, id, callback) {
  const firstPageUrl = `/alis/EK/do_view.php?id=${id}`;
  const INITIAL_URL = `${alisEndpoint}${firstPageUrl}`;
  getPage({ url: INITIAL_URL }, (err, body) => {
    if (err) return callback(err);
    if (body.match('Undefined variable')) return callback(new Error('Record not found'));
    const $ = parsePage(body);
    const info = getRecordInfo($);
    info.id = id;
    return callback(null, info);
  });
}
