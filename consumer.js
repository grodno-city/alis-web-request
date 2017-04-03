const sendInitialQuery = require('./index');

function handleInitialQuery(err, body) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(body);
}

const initialParameters = {
  year: 2016,
  ip: '86.57.174.45',
  cookieId: '83rsshjic1q0f0a6pssm960d36',
};

sendInitialQuery(initialParameters, handleInitialQuery);
