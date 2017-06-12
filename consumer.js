import { sendInitialQuery, getNumberedPageUrls, run, processItems, parsePage } from './index';

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
