// DEBUG=alis-web-request yarn babel-node bin/get-record-by-id.js [ID]

import { getRecordByID } from '../src/index';

const options = {
  id: process.argv[2],
  // Электронны каталог https://grodnolib.by/
  alisEndpoint: 'http://86.57.174.45',
};

getRecordByID(options.alisEndpoint, options.id, (err, record) => {
  if (err) {
    console.log(err.message);
  } else console.log(record);
});
