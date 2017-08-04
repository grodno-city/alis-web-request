import { getRecordsByQuery } from './src/index';


const initParams = {
  query: '',
  alisEndpoint: 'http://86.57.174.45',
  recordType: 'Книги',
  queryType: 'Все',
};

const cb = (err, memo) => {
  if (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
      console.log(err.code, 'restart');
      getRecordsByQuery(initParams, cb);
    }
    console.log(err.message);
  } else {
    console.log('memo.length All: ', memo.length);
  }
};

getRecordsByQuery(initParams, cb);
