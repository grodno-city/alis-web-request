const cheerio = require('cheerio');
const request = require('request');

const j = request.jar();

export function sendInitialQuery(query, callback) {
  const START_URL = `http://${query.ip}/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=1&tag=6`;
  request({ url: START_URL, jar: j }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, { page: body, jar: j });
});
}

export function getPage(url, callback) {
  request({ url, jar: j }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, body);
});
}

export function getFirstTenUrls(page) {
  const $ = cheerio.load(page);
  const firstTenPageLinks = $('a[href^=\'do_other\']');
  const firstTenPageUrls = $(firstTenPageLinks).map((i, link) => `http://86.57.174.45/alis/EK/${$(link).attr('href')}`).toArray();
  return firstTenPageUrls;
}

export function getPageUrl(page) {
  const $ = cheerio.load(page);
  const pageLink = $('#Agt');
  const pageUrl = (`${$(pageLink).attr('href')}`);
  return pageUrl;
}

export function getBooks(page) {
  const $ = cheerio.load(page);
  const books = [];
  $('.article').each(function () {
    books.push($(this).text());
  });
  return books;
}
