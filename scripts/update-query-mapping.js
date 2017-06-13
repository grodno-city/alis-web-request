import request from 'request';
import cheerio from 'cheerio';

function getTypes($, type) {
  const obj = {};
  $(`[name=${type}]`).children().map((i, el) => {
    const str = $(el).text();
    obj[str] = $(el).attr('value');
  });
  return obj;
}
// http://86.57.174.45/pls/alis/StartEK/index.php
request({ url: 'http://86.57.174.45/pls/alis/EK/simple.php' }, (err, res, body) => {
  const $ = cheerio.load(body);
  const recordTypes = getTypes($, 'tema');
  const queryTypes = getTypes($, 'tag');
  const qM = { recordType: recordTypes, queryType: queryTypes };
  const str = JSON.stringify(qM);
  process.stdout.write(str);
});
