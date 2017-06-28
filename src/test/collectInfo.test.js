import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { collectInfo } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/record.html'));

describe('collectInfo', () => {
  it('should be a function', () => {
    expect(typeof collectInfo).to.equal('function');
  });

  it('shoud return an array', () => {
    const $ = cheerio.load(record);
    const firstTable = $('table').first();
    const funds = collectInfo(firstTable);
    expect(funds).to.be.an('array');
  });
  it('each arrays element shoud be { name: String, count: Number }', () => {
    const $ = cheerio.load(record);
    const firstTable = $('table').first();
    const funds = collectInfo(firstTable);
    funds.forEach((el) => {
      expect(el).to.include.all.keys('tag', 'field');
    });
  });
});
