import fs from 'fs';
import { sendInitialQuery } from '../../index';

function writeLongResult(err, result) {
  if (err) {
    return;
  }
  fs.writeFileSync('./test/fixtures/long-results.html', result.page);
}

function writeShortrResult(err, result) {
  if (err) {
    return;
  }
  fs.writeFileSync('./test/fixtures/short-results.html', result.page);
}

const longParams = {
  year: 2016,
  alisEndpoint: 'http://86.57.174.45',
};

sendInitialQuery(longParams, writeLongResult);

const shortParams = {
  year: 2017,
  alisEndpoint: 'http://86.57.174.45',
};

sendInitialQuery(shortParams, writeShortrResult);
