import request from 'request';
import fs from 'fs';
import { getPage, parsePage } from '../index.js';

function getTypes($, type) {
  const obj = {};
  const types = $('[name=' + type + ']').children().map((i, el) => {
    const str = $(el).text();
    obj[str] = $(el).attr('value');
  });
  return obj;
}
// http://86.57.174.45/pls/alis/StartEK/index.php
const j = request.jar();
getPage({ url: 'http://86.57.174.45/pls/alis/EK/simple.php', jar: j }, (err, body) => {
  const $ = parsePage(body);
  const recordTypes = getTypes($, 'tema');
  const queryTypes = getTypes($, 'tag');
  const qM = { recordType: recordTypes, queryType: queryTypes };
  const str = JSON.stringify(qM);
  fs.writeFileSync('./queryMap.js', str);
})
