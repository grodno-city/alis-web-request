import request from 'request';

const options = {
  id: 28392,
  alisEndpoint: 'http://86.57.174.45',
};
const firstPageUrl = `/alis/EK/do_view.php?id=${options.id}`;
const INITIAL_URL = `${options.alisEndpoint}${firstPageUrl}`;

request({ url: INITIAL_URL }, (err, res, body) => {
  if (!err) process.stdout.write(body);
});
