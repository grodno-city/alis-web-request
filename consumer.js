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
};

sendInitialQuery(initialParameters, handleInitialQuery);
