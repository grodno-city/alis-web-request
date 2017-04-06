const request = require('request');

function sendInitialQuery(query, callback) {
  if (!query.year) {
    const err = `Error: query.year is not provided`;
    callback(err);
    return;
  }
  const j = request.jar();
  const START_URL = `http://${query.ip}/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=1&tag=6`;
  request({ url: START_URL, jar: j }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, { page: body, jar: j });
});
}

function getPage(options, callback) {
  request({ url: options.url, jar: options.jar }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, body);
});
}

function getNumberedPageUrls(page) {
  const $ = cheerio.load(page);
  const firstTenPageLinks = $('a[href^=\'do_other\']');
  const firstTenPageUrls = $(firstTenPageLinks).map((i, link) => `http://86.57.174.45/alis/EK/${$(link).attr('href')}`).toArray();
  return firstTenPageUrls;
}

function getNextPageUrl(page) {
  const pageLink = page('#Agt');
  const pageUrl = (`${page(pageLink).attr('href')}`);
  return pageUrl;
}

function getBooks(page) {
  const books = [];
  page('.article').each(function () {
    books.push(page(this).text());
  });
  return books;
}

module.exports = {
  sendInitialQuery,
  getPage,
  getNumberedPageUrls,
  getNextPageUrl,
  getBooks
};