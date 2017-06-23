import querystring from 'querystring';
import request from 'request';
import cheerio from 'cheerio';
import queryMap from './queryMap.json';
import cheerioTableparser from'cheerio-tableparser';

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

export function getRecordInfo($) {
  cheerioTableparser($);
  const data = $('table').parsetable(false, false, true);
  const info = {};
  info.unknown = [];
  for (let i = 0; i < data[0].length; i++) {
    if (data[0][i].endsWith(' .')) {
      data[0][i] = data[0][i].slice(0, data[0][i].length - 2);
    }
    if (data[1][i] !== undefined) {
      if (data[1][i].endsWith(' .')) {
        data[1][i] = data[1][i].slice(0, data[1][i].length - 2);
      }
    }
    if (data[0][i] === 'Фонд') info[data[0][i]] = {};
    else if (data[0][i] === 'Ссылки на др. биб.записи') {
      info.tags = [];
      for (let j = i + 1; j < data[0].length; j++) {
        let str = data[0][j].split('*');
        info.tags = info.tags.concat(str);
      }
      break;
    }
    else if (data[0][i].match('фондир')) {
      info['Фонд'][data[0][i]] = data[1][i];
    }
    else if (data[0][i] === 'ISBN') {
      info[data[0][i]] = data[1][i].split(', ');
    }
    else if (data[0][i] === '') {
      info.unknown.push(data[1][i]);
    }
    else info[data[0][i]] = data[1][i];
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
