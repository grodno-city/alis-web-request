import Stream from 'stream';
import { sendInitialQuery, getNumberedPageUrls, run, processItems, parsePage, ReadableStreamItems } from './index';

const WritableStreamItems = new Stream.Writable({ objectMode: true });

ReadableStreamItems.pipe(WritableStreamItems);

const initParams = {
  year: 2017,
  alisEndpoint: 'http://86.57.174.45',
};

sendInitialQuery(initParams, (err, res) => {
  if (err) {
    return new Error(err);
  }

  const options = {
    alisEndpoint: initParams.alisEndpoint,
    jar: res.jar,
  };
  const $ = parsePage(res.page);
  const firstNumberedPageUrls = getNumberedPageUrls($);

  run(processItems, firstNumberedPageUrls, options);
});

const items = [];

WritableStreamItems._write = (item, encoding, done) => {
  items.push(item);
  done();
};
