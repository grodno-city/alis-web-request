import cheerio from 'cheerio';
import { expect } from 'chai';
import { readFixture } from './fixtures.mjs';
import { collectFunds, getTable } from '../index.mjs';

const record = await readFixture('recordWithFunds');

describe('collectFunds', () => {
  it('should be a function', () => {
    expect(typeof collectFunds).to.equal('function');
  });

  it('shoud return an array', () => {
    const $ = cheerio.load(record);
    const fundsTable = getTable($, 'funds');
    const funds = collectFunds(fundsTable);
    expect(funds).to.be.an('array');
  });
  it('each arrays element shoud be { name: String, count: Number }', () => {
    const $ = cheerio.load(record);
    const fundsTable = getTable($, 'funds');
    const funds = collectFunds(fundsTable);
    funds.forEach((el) => {
      expect(el).to.include.all.keys('name', 'count');
    });
  });
});
