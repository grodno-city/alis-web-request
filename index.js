const request = require('request');

function sendInitialQuery(query, callback) {
  const START_URL = `http://${query.ip}/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=1&tag=6`;
  const j = request.jar();
  request({ url: START_URL, jar: j }, (err, response, html) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, { page: html, jar: j });
  });
}

function getPage(options, callback) {
  request({ url: options.url, jar: options.jar }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, body);
  });
}

module.exports = {
  sendInitialQuery,
  getPage,
};
