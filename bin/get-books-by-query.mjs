/* eslint-disable no-console */
// DEBUG=alis-web-request yarn babel-node bin/get-books-by-query.js
import Query from '../src/Query.mjs';

const options = {
  // Электронны каталог https://grodnolib.by/
  alisEndpoint: 'http://86.57.174.45',
  recordType: 'Книги',
  query: 'Питер',
  queryType: 'Издательство',
};

const main = async () => {
  try {
    const query = new Query(options);
    const searchResultsPage = await query.send();
    const items = await searchResultsPage.getItems();

    console.log({ total: searchResultsPage.getResultsTotal(), items });
  } catch (err) {
    if (err.message === 'no match') {
      console.log({
        options,
        status: 404,
      });
    }
  }
};

main();
