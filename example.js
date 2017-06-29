import { getRecordByID } from './src/index';

const options = {
  id: 28392,
  alisEndpoint: 'http://86.57.174.45',
};
getRecordByID(options.alisEndpoint, options.id, (err, record) => {
  if (err) {
    console.log(err.message);
  } else console.log(record);
});
