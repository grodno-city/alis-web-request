# alis-web-request

Request data from ALIS WEB system

## Installing

npm
```
npm install alis-web-request --save
```

yarn 
```
yarn add alis-web-request
```

## API methods 

* sendInitialQuery - make initial http query to alis library for get main page and cookie id.
* getPage - get page body from the specified url.
* getNumberedPageUrls - get firs ten numbered urls from main page.
* getNextPageUrl - get next page url from the specified url.
* processItems - to managements another functions getPage, getNextPageUrl, pushItemsToStream.
* getItems - get id with title all books on the page.
* run - run processItems function over queue with options.
* ReadableStreamItems - readable stream for read items. 

## Examples

```js
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

```

## Authors
* **Vadim Demyanchik** - [GitHub](https://github.com/DemyanchikVadim)
* **Pavel Zubkou** - [GitHub](https://github.com/irnc)

## License

[MIT License ](https://github.com/grodno-city/alis-web-request/blob/master/LICENSE)
