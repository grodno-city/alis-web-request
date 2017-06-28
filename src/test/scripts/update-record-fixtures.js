import request from 'request';
import fs from 'fs';

const options = {
  pageWithYears: 28392,
  pageWithFunds: 21989,
  alisEndpoint: 'http://86.57.174.45',
};

request({ url: `${options.alisEndpoint}/alis/EK/do_view.php?id=${options.pageWithYears}` }, (err, res, body) => {
  if (!err) fs.writeFileSync('./src/test/fixtures/recordWithYears.html', body);
});

request({ url: `${options.alisEndpoint}/alis/EK/do_view.php?id=${options.pageWithFunds}` }, (err, res, body) => {
  if (!err) fs.writeFileSync('./src/test/fixtures/recordWithFunds.html', body);
});
