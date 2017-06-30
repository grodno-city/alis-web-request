import request from 'request';
import fs from 'fs';

const alisEndpoint = 'http://86.57.174.45';
const pages = [
  { tag: 'WithYears', id: 28392 },
  { tag: 'WithFunds', id: 21989 },
  { tag: 'WithEmptyFieldsValue', id: 46273 },
];
pages.forEach((el) => {
  request({ url: `${alisEndpoint}/alis/EK/do_view.php?id=${el.id}` }, (err, res, body) => {
    if (!err) {
      fs.writeFileSync(`./src/test/fixtures/record${el.tag}.html`, body);
    } else {
      console.log(err);
    }
  });
});
