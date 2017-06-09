import { sendInitialQuery, getNumberedPageUrls, run, processItems, parsePage } from './index';

const initParams = {
  query: 1930,
  alisEndpoint: 'http://86.57.174.45',
  recordType: "Книги",
  queryType: "Год издания",
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
const remainingQueue = firstNumberedPageUrls;
run(processItems, remainingQueue, [], options, (runErr, memo) => {
  if (err) {
    return err;
  }
  console.log('memo.length All: ', memo.length);
});
});
