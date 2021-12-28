import querystring from 'querystring';
import request from 'request';
import cheerio from 'cheerio';
import debug from 'debug';
import { readFile } from 'fs/promises';
import cacheManager from 'cache-manager';
import fsHashStore from 'cache-manager-fs-hash';

const queryMap = JSON.parse(await readFile(new URL('./queryMap.json', import.meta.url), { encoding: 'utf-8' }));
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
    valueINP: params.query,
    tema: queryMap.recordType[params.recordType],
    tag: queryMap.queryType[params.queryType],
  });
  const firstPageUrl = `/alis/EK/do_searh.php?${qs}`;
  const INITIAL_URL = `${alisEndpoint}${firstPageUrl}`;

  log(`sendInitialQuery: ${INITIAL_URL}`);

  request({ url: INITIAL_URL, jar: j }, (err, response, body) => {
    if (err) {
      return callback(err);
    }
    callback(null, { page: body, jar: j });
  });
}

const CACHE_DIR = new URL('../.cache', import.meta.url);

const pageCache = cacheManager.caching({
  store: fsHashStore,
  options: {
    ttl: 60 * 60 * 24 /* 1 day in seconds */,
    maxsize: 1000 * 1000 * 1000 /* max size in bytes on disk */,
    path: `${CACHE_DIR.pathname}/pages`,
    subdirs: true,
  },
});

export function getPage(options, callback) {
  const { url, jar, initParams, noCache = false } = options;

  log(`getPage: ${url}`);

  // TODO sort initParams entries to allow cache reuse on different props order
  const cacheKey = JSON.stringify({ url, ...initParams });
  const doRequest = (cacheCallback) => {
    request({ url, jar }, (err, response, body) => {
      if (err) {
        return cacheCallback(err);
      }
      cacheCallback(null, body);
    });
  };

  if (noCache) {
    doRequest(callback);
  } else {
    pageCache.wrap(cacheKey, doRequest, {}, callback);
  }
}

export function getTotal($) {
  return Number($('.listbzstat').first().text().match(/\d+(?=\sзап\.)/)[0]);
}

/**
 *
 * @param {cheerio.Cheerio} $
 * @returns {{ id: string, title: string }[]}
 */
export function getItems($) {
  const items = $('.article').map(function (i, el) {
    return {
      id: $(el).attr('id').replace(/^H/, ''),
      title: $(el).text().trim(),
    };
  }).toArray();
  return items;
}

export function getNumberedPageUrls($) {
  // `fcheck` гэта лічба першай нумарованай старонкі, усяго іх будзе паказана дзевяць.
  //
  // `ccheck`, `crow`, `frow` не маюць дзеянне, але бяз іх з'яўляецца Notice.
  // Notice: Undefined index: ccheck in E:\ALIS\pls\alis\EK\do_other.php on line 42
  // Яны задаюцца аўтаматычна у нумар старонкі, і першы нумар рэзультату.
  //
  // `action` гэта нумар старонкі для паказа.
  const pageLinks = $('a[href^=\'do_other\']');
  const relativePageUrls = $(pageLinks).map((i, link) => $(link).attr('href').replace(/\r|\n/g, '')).toArray();
  return relativePageUrls;
}

/**
 * Parses page and gives cheerio wrapper
 *
 * @param {string} body HTML
 * @returns cheerio object
 */
export function parsePage(body) {
  const $ = cheerio.load(body);
  return $;
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
