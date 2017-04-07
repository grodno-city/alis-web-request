import { sendInitialQuery, getPage, getFirstTenUrls, getPageUrl, getBooks } from './index';

const books = [];

function run(fn, q) {
  if (q.length === 0) {
    console.log('end of queue');
    return;
  }

  fn(q[0], (err, page) => {
    if (err) {
      console.log(err);
      return;
    }
    const twentyBooks = getBooks(page);
    twentyBooks.forEach((elem, i) => {
      books.push(twentyBooks[i]);
    });

    console.log(books.length);
    const remainingQueue = q.slice(1);
    const nextPageUrl = getPageUrl(page);
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

sendInitialQuery({ year: 2016, ip: '86.57.174.45' }, (err, res) => {
  if (err) {
    console.log(err);
    return;
  }
  const firstTenPageUrls = getFirstTenUrls(res.page);
  run(getPage, firstTenPageUrls);
});