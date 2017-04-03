const request = require('request');

function sendInitialQuery(query, callback) {
  const START_URL = `http://${query.ip}/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=1&tag=6`;
  const j = request.jar();
  j.setCookie(
    request.cookie(`sessionalis=${query.cookieId}`),
    'http://86.57.174.45/pls/alis/StartEK/index.php'
  );
  request({ url: START_URL, jar: j }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, { page: body, jar: j });
  });
}

function getPage(query, callback) {
  request({ url: query.url, jar: query.jar }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, body);
  });
}

module.exports = sendInitialQuery;
