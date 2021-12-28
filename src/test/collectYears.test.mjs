import cheerio from 'cheerio';
import { readFixture } from './fixtures.mjs';
import { expect } from 'chai';
import { collectYears, getTable } from '../index.mjs';

const record = await readFixture('recordWithYears');

describe('collectYears', () => {
  it('should be a function', () => {
    expect(typeof collectYears).to.equal('function');
  });

  it('shoud return an array', () => {
    const $ = cheerio.load(record);
    const yearsTable = getTable($, 'years');
    const years = collectYears(yearsTable);
    expect(years).to.be.an('array');
  });
  it('each arrays element shoud be { name: String, count: Number }', () => {
    const $ = cheerio.load(record);
    const yearsTable = getTable($, 'years');
    const years = collectYears(yearsTable);
    years.forEach((el) => {
      expect(el).to.be.a('number');
    });
  });
});
