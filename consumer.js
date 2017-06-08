import {
  sendInitialQuery,
  getNumberedPageUrls,
  run,
  processItems,
  parsePage,
} from './index';

const initParams = {
  query: 2010,
  alisEndpoint: 'http://86.57.174.45',
  tema: 1,
  tag: 6,
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

// const pageNumber = 1;
// returnPagesItems(options, pageNumber, total, (err, items, nextPageUrl) => {
//   if (!err) {
//     remainingQueue.splice(pageNumber - 1, 1);
//     if (remainingQueue.length === 1) {
//       remainingQueue.push(`${nextPageUrl}`);
//     }
//     // indexItems(items);
//     console.log(items);
//     console.log('q : ', remainingQueue);
//   }
//   return err;
// });
