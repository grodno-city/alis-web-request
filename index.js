import request from 'request';
import cheerio from 'cheerio';

import queryMap from './queryMap.json'

// const initParams = {
//   query: 'string',
//   alisEndpoint: 'http://86.57.174.45',
//   recordType: "Книги",
//   queryType: "Год издания",
// };
export function sendInitialQuery(params, callback) {
  if (!params.query) {
    return process.nextTick(callback, new Error('params is not provided'));
  }
  const j = request.jar();
  const alisEndpoint = `${params.alisEndpoint}`;
  const firstPageUrl = `/alis/EK/do_searh.php?radiodate=simple&valueINP=${encodeURIComponent(params.query)}&tema=${queryMap.recordType[params.recordType]}&tag=${queryMap.queryType[params.queryType]}`
  const INITIAL_URL = `${alisEndpoint}${firstPageUrl}`;

  request({ url: INITIAL_URL, jar: j }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
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

export function processItems(options, callback) {
  if (!options) {
    return process.nextTick(callback, new Error('options is not provided'));
  }

  getPage({ url: options.url, jar: options.jar }, (err, body) => {
    const $ = parsePage(body);
    const nextPageUrl = getNextPageUrl($);
    callback(null, nextPageUrl);
  });
}

export function run(fn, q, options) {
  if (!q) {
    return new Error('q is not provided');
  }

  if (q[0] === 'undefined') {
    return;
  }

  fn({ url: `${options.alisEndpoint}/alis/EK/${q[0]}`, jar: options.jar }, (err, nextPageUrl) => {
    if (err) {
      return err;
    }

    const remainingQueue = q.slice(1);
    if (q.length === 1) {
      remainingQueue.push(`${nextPageUrl}`);
    }

    run(fn, remainingQueue, options);
  });
}
