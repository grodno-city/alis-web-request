import fs from 'fs';
import { sendInitialQuery } from '../../index.mjs';

const write = (fixtureName, result) => {
  fs.writeFileSync(new URL(`../fixtures/${fixtureName}.html`, import.meta.url), result.page);
}

function writeLongResult(err, result) {
  if (err) {
    throw err;
  }
  write('long-results', result);
}

function writeShortrResult(err, result) {
  if (err) {
    throw err;
  }
  write('short-results', result);
}

const longParams = {
  alisEndpoint: 'http://86.57.174.45',
  recordType: 'Книги',
  query: '2016',
  queryType: 'Год издания',
};

sendInitialQuery(longParams, writeLongResult);

const shortParams = {
  alisEndpoint: 'http://86.57.174.45',
  recordType: 'Книги',
  query: '2017',
  queryType: 'Год издания',
};

sendInitialQuery(shortParams, writeShortrResult);
