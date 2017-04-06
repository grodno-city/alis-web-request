const request = require('request');

function sendInitialQuery(query, callback) {
  if (!query.year) {
    const err = `Error: query.year is not provided`;
    callback(err);
    return;
  }
  const j = request.jar();
  const START_URL = `http://${query.ip}/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=1&tag=6`;
  request({ url: START_URL, jar: j }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, { page: body, jar: j });
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