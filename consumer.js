import Stream from 'stream';
import { sendInitialQuery, getPage, getNumberedPageUrls, run, ReadableStreamBooks } from './index';

const WritableStreamBooks = new Stream.Writable();
ReadableStreamBooks.pipe(WritableStreamBooks);

const books = [];

const initParams = {
  year: 2015,
  ip: '86.57.174.45',
};

sendInitialQuery(initParams, (err, res) => {
  if (err) {
    console.log(err);
    return;
  }
  const firstTenPageUrls = getNumberedPageUrls(res.page, initParams.ip);
  run(getPage, firstTenPageUrls, initParams.ip, res.jar);
});

WritableStreamBooks._write = (book, encoding, done) => {
  books.push(book);
  console.log(`STREAM ${books.length}`);
  // ready to process the next chunk
  done();
};
