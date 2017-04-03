const request = require('request');
const SESSION_ID = require('./config.json').SESSION_ID;

const j = request.jar();

j.setCookie(
  request.cookie(`sessionalis=${SESSION_ID}`),
  'http://86.57.174.45/pls/alis/StartEK/index.php'
);

function sendInitialQuery(query, callback) {
  const START_URL = `http://86.57.174.45/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=ALL&tag=ALL`;
  request({ url: START_URL, jar: j }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, body);
  });
}

function getPage(url, callback) {
  request({ url, jar: j }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, body);
  });
}

sendInitialQuery({ year: 2016 }, (err, body) => {
  console.log(body);
});
