import request from 'request';

export function sendInitialQuery(query, callback) {
  if (!query.year) {
    return process.nextTick(callback, new Error('query.year is not provided'));
  }
  const j = request.jar();
  const INITIAL_URL = `http://${query.ip}/alis/EK/do_searh.php?radiodate=simple&valueINP=${query.year}&tema=1&tag=6`;
  request({ url: INITIAL_URL, jar: j }, (err, response, body) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, { page: body, jar: j });
  });
}

export function getPage(url, jug, callback) {
  request({ url, jar: jug }, (err, response, body) => {
    if (err) {
      return callback(err);
    }
    callback(null, body);
  });
}
