import Stream from 'stream';
import { getBooks } from './index';

const WritableStreamItems = new Stream.Writable({ objectMode: true });

const initParams = {
  query: 2016,
  alisEndpoint: 'http://86.57.174.45',
  tema: 1,
  tag: 6,
};

getBooks(initParams).pipe(WritableStreamItems);

const books = [];

WritableStreamItems._write = (items, encoding, done) => {
  items.map(el =>
   books.push({
     id: el.id,
     title: el.title,
   }),
  );

  done();
};
