const AlisWebRequest = require('./index');

function handleInitialQuery(err, res) {
  if (err) {
    console.log(err);
    return;
  }
  // here need parser res.page to get url
  const initParams = {
    url: 'http://86.57.174.45/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&crow=1&action=10',
    jar: res.jar,
  };
  AlisWebRequest.getPage(initParams, (error, response) => {
    console.log(response.page);
  });
}

const initialRequestParameters = {
  year: 2016,
  ip: '86.57.174.45',
};

AlisWebRequest.sendInitialQuery(initialRequestParameters, handleInitialQuery);
