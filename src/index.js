import querystring from 'querystring';
import request from 'request';
import cheerio from 'cheerio';
import debug from 'debug';
import queryMap from './queryMap.json';

const log = debug('alis-web-request');

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
  log(`getPage: ${options.url}`);

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
    if (res.page.match('<title>Не результативный поиск</title>')) {
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

export function collectFields($, table) {
  const fields = table.find('tr')
    .filter((i, tr) => {
      return $('tr:nth-child(1) th:nth-child(1)', tr).text() !== 'Название';
    }).map((i, tr) => {
      return {
        tag: $('td:nth-child(1)', tr).text(),
        value: $('td:nth-child(2)', tr).text(),
      };
    }).get();
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

export function getTable($, name) {
  const nameToTitle = {
    years: 'Год(комплект)',
    references: 'Ссылки на др. биб.записи',
    fields: 'Название',
    funds: 'Фонд',
  };
  const tablesIndex = $('table').map((i, table) => {
    const $table = $(table);
    const title = $('tr:nth-child(1) th:nth-child(1)', table).text();
    return { title, $table };
  });
  const find = tablesIndex.get().find(el => el.title === nameToTitle[name]);
  if (find) return find.$table;
  return undefined;
}

export function getRecordInfo($) {
  const years = getTable($, 'years');
  const references = getTable($, 'references');
  const fields = getTable($, 'fields');
  const funds = getTable($, 'funds');
  return {
    belmarcId: $('span')[0].children[0].data.substr(4),
    years: years ? collectYears(years) : [],
    references: references ? collectReferences(references) : [],
    fields: fields ? collectFields($, fields) : [],
    funds: funds ? collectFunds(funds) : [],
  };
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
