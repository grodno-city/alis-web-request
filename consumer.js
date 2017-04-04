const AlisWebRequest = require('./index');

function handleInitialQuery(err, options) {
  if (err) {
    console.log(err);
    return;
  }
  AlisWebRequest.getPage(options);
}

const initialParameters = {
  year: 2016,
  ip: '86.57.174.45',
};

AlisWebRequest.sendInitialQuery(initialParameters, handleInitialQuery);
