import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { getRecordInfo } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/record.html'));

describe('getRecordInfo', () => {
  it('should be a function', () => {
    expect(typeof getRecordInfo).to.equal('function');
  });

  it('shoud return an object', () => {
    const $ = cheerio.load(record);
    const info = getRecordInfo($);
    expect(info).to.be.an('object');
  });


});
