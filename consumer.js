import {
  sendInitialQuery,
  getNumberedPageUrls,
  run,
  processItems,
  parsePage,
  getTotal,
  returnPagesItems
} from './index';

const initParams = {
  query: 2016,
  alisEndpoint: 'http://86.57.174.45',
  tema: 1,
  tag: 6,
};

sendInitialQuery(initParams, (err, res) => {
  if (err) {
    return new Error(err);
  }
  console.log('in in send');
  const options = {
    alisEndpoint: initParams.alisEndpoint,
    jar: res.jar
  };
  const $ = parsePage(res.page);
  const firstNumberedPageUrls = getNumberedPageUrls($);
  let remainingQueue = firstNumberedPageUrls;
  let total = getTotal($);
  console.log('total', total);
  // run(processItems, remainingQueue, options, (err, items)=>{
  //   if (err) {
  //     return err;
  //   }
  // console.log('items');
  // });
  let pageNumber = 1;
  returnPagesItems(options, pageNumber, total, (err, items, nextPageUrl) => {
    if (!err) {
      remainingQueue.splice(pageNumber - 1, 1);
      if (remainingQueue.length === 1) {
        remainingQueue.push(`${nextPageUrl}`);
      }
      //indexItems(items);
      console.log(items);
      console.log('q : ', remainingQueue);

    }
    return err;
    //do_other.php?frow=1&fcheck=1&ccheck=1&action=3&crow=1

  });

});
