
import { sendInitialQuery, getNumberedPageUrls, run, processItems, parsePage, getRecordsByQuery } from './index';


const initParams = {
  query: 1960,
  alisEndpoint: 'http://86.57.174.45',
  recordType: "Книги",
  queryType: "Год издания",
};
getRecordsByQuery(initParams, (err, memo) => {
  console.log('memo.length All: ', memo.length);
});
