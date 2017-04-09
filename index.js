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

export function getPage(url, jug, callback) {
  request({ url, jar: jug }, (err, response, body) => {
    if (err) {
      return callback(err);
    }
    callback(null, body);
  });
}

export function getNextPageUrl($) {
  const pageLink = $('#Agt');
  const pageUrl = (`${$(pageLink).attr('href')}`);
  return pageUrl;
}

export function getBooks($) {
  return $('.article').each(function () {
    ReadableStreamBooks.push($(this).text());
  });
}

export function getNumberedPageUrls(page, ip) {
  const $ = cheerio.load(page);
  const firstTenPageLinks = $('a[href^=\'do_other\']');
  const firstTenPageUrls = $(firstTenPageLinks).map((i, link) => `http://${ip}/alis/EK/${$(link).attr('href')}`).toArray();
  return firstTenPageUrls;
}
