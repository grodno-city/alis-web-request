import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { collectFunds } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/recordWithFunds.html'));

describe('collectFunds', () => {
  it('should be a function', () => {
    expect(typeof collectFunds).to.equal('function');
  });

  it('shoud return an array', () => {
    const $ = cheerio.load(record);
    const thirdTable = $('table').first().next('table');
    const funds = collectFunds(thirdTable);
    expect(funds).to.be.an('array');
  });
  it('each arrays element shoud be { name: String, count: Number }', () => {
    const $ = cheerio.load(record);
    const thirdTable = $('table').first().next('table');
    const funds = collectFunds(thirdTable);
    funds.forEach((el) => {
      expect(el).to.include.all.keys('name', 'count');
    });
  });
});
