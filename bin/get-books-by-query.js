// DEBUG=alis-web-request yarn babel-node bin/get-books-by-query.js
import { promisify } from 'bluebird';
import { getRecordsByQuery as getRecordsByQueryCallback } from '../src/index';

const options = {
  // Электронны каталог https://grodnolib.by/
  alisEndpoint: 'http://86.57.174.45',
  recordType: 'Книги',
  query: 'Питер',
  queryType: 'Издательство',
};

const getRecordsByQuery = promisify(getRecordsByQueryCallback);

// TODO
const main = async () => {
  try {
    const records = await getRecordsByQuery(options);

    console.log(records);
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
