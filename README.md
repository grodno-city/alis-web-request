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

## API

* ReadableStreamBooks - get all books by year through stream 
* sendInitialQuery - make initial http query
* getPage - get page body
* getNumberedPageUrls - get ten page urls
* getNextPageUrl - get next page url
* getBooks - get books on the page
* run - recursive runner


## Examples

You can save books, for example in a database.
In the following example, the books are stored in an array.
```js
import Stream from 'stream';
import { sendInitialQuery, getPage, getNumberedPageUrls, run, ReadableStreamBooks } from 'alis-web-request';

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
  console.log(`STREAM: ${books.length}`);
  // ready to process the next chunk
  done();
};

```

## Built With

* [request](https://github.com/request/request) - Simplified HTTP client
* [cheerio](https://github.com/cheeriojs/cheerio) - Fast, flexible & lean implementation of core jQuery designed specifically for the server.

## Authors
* **Vadim Demyanchik** - [GitHub](https://github.com/DemyanchikVadim)
* **Pavel Zubkou** - [GitHub](https://github.com/irnc)

## License

[MIT License ](https://github.com/grodno-city/alis-web-request/blob/master/LICENSE)
