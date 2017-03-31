const cheerio = require('cheerio');
const request = require('request').defaults({ jar: true });

const books = [];

function sendInitialQuery(query, callback) {
  const START_URL = `http://86.57.174.45/alis/EK/do_searh.php?radiodate=simple&valueINP=${query}&tema=ALL&tag=ALL`;
  request(START_URL, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, body);
  });
}

function getPage(url, callback) {
  request(url, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, body);
  });
}

function run(fn, q) {
  if (q.length === 0) {
    console.log('end of queue');
    return;
  }

  console.log(q);

  fn(q[0], (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const $ = cheerio.load(data);
    const nextPageLink = $('#Agt');
    const nextPageUrl = (`${$(nextPageLink).attr('href')}`);
    const remainingQueue = q.slice(1);
    // scrape 20 books
    $('.article').each(() => {
      books.push($(this).text());
    });

    console.log(books.length);

    if (nextPageUrl === 'undefined') {
      console.log('end of queue');
      return;
    }

    if (q.length === 1) {
      remainingQueue.push(`http://86.57.174.45/alis/EK/${nextPageUrl}`);
    }

    run(fn, remainingQueue);
  });
}

function startRunner(err, body) {
  if (err) {
    console.log(err);
    return;
  }
  const $ = cheerio.load(body);
  const firstTenPageLinks = $('a[href^=\'do_other\']');
  const firstTenPageUrls = $(firstTenPageLinks).map((i, link) => `http://86.57.174.45/alis/EK/${$(link).attr('href')}`).toArray();
  run(getPage, firstTenPageUrls);
}

sendInitialQuery(2016, startRunner);
