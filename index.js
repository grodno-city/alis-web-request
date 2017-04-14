import request from 'request';
import cheerio from 'cheerio';

export function sendInitialQuery(query, callback) {
  if (!query.year) {
    return process.nextTick(callback, new Error('query.year is not provided'));
  }
  const j = request.jar();
  const INITIAL_URL = `${query.alisEndpoint}/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=1&tag=6`;
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

export function getTotalResult($) {
  const totalResult = $('.listbzstat').first().text().match(/\d+(?=\sзап\.)/)[0];
  return totalResult;
}

export function getTotalItems($) {
  let totalItems = 0;
  $('.article').each(() => {
    totalItems += 1;
  });
  return totalItems;
}

export function getItems($) {
  const items = [];
  $('.article').each(function () {
    items.push(
      {
        id: $(this).attr('id'),
        title: $(this).text(),
      });
  });
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
    getItems($);
    const nextPageUrl = getNextPageUrl($);
    callback(null, nextPageUrl);
  });
}

export function run(fn, q, options) {
  if (!q) {
    return new Error('q is not provided');
  }
  fn({ url: `${options.alisEndpoint}/alis/EK/${q[0]}`, jar: options.jar }, (err, nextPageUrl) => {
    if (err) {
      return err;
    }
    const remainingQueue = q.slice(1);
    if (nextPageUrl === undefined) {
      return;
    }
    if (q.length === 1) {
      remainingQueue.push(`${nextPageUrl}`);
    }
    run(fn, remainingQueue, options);
  });
}
