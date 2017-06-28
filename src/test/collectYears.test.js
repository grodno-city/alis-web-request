import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { collectYears } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/record.html'));

describe('collectYears', () => {
  it('should be a function', () => {
    expect(typeof collectYears).to.equal('function');
  });

  it('shoud return an array', () => {
    const $ = cheerio.load(record);
    const thirdTable = $('table').first().next('table');
    const funds = collectYears(thirdTable);
    expect(funds).to.be.an('array');
  });
  it('each arrays element shoud be { name: String, count: Number }', () => {
    const $ = cheerio.load(record);
    const secondTable = $('table').first().next('table');
    const funds = collectYears(secondTable);
    funds.forEach((el) => {
      expect(el).to.be.a('string');
    });
  });
});
