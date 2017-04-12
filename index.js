import request from 'request';
import cheerio from 'cheerio';

export function sendInitialQuery(query, callback) {
  if (!query.year) {
    return process.nextTick(callback, new Error('query.year is not provided'));
  }
  const j = request.jar();
  const INITIAL_URL = `http://${query.ip}/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=1&tag=6`;
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

export function getBooks($) {
  const books = [];
  $('.article').each(function () {
    books.push($(this).text());
  });
  return books;
}

export function getNumberedPageUrls($, ip) {
  const relativePageUrls = $('a[href^=\'do_other\']');
  const absolutePageUrls = $(relativePageUrls).map((i, link) => `http://${ip}/alis/EK/${$(link).attr('href').replace(/\n/, '')}`).toArray();
  return absolutePageUrls;
}

export function parsePage(body) {
  const $ = cheerio.load(body);
  return $;
}

export function processBooks(options, callback) {
  if (!options) {
    return process.nextTick(callback, new Error('options is not provided'));
  }
  getPage({ url: options.url, jar: options.jar }, (err, body) => {
    const $ = parsePage(body);
    getBooks($);
    const nextPageUrl = getNextPageUrl($);
    callback(null, nextPageUrl);
  });
}

export function run(fn, q, options) {
  if (!q) {
    return new Error('q is not provided');
  }
  fn({ url: q[0], jar: options.jar }, (err, nextPageUrl) => {
    if (err) {
      return err;
    }
    const remainingQueue = q.slice(1);
    if (nextPageUrl === undefined) {
      return;
    }
    if (q.length === 1) {
      remainingQueue.push(`http://${options.ip}/alis/EK/${nextPageUrl}`);
    }
    run(fn, remainingQueue, options);
  });
}
