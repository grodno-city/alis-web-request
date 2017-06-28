import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { collectFunds } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/record.html'));

describe('collectFunds', () => {
  it('should be a function', () => {
    expect(typeof collectReferences).to.equal('function');
  });

  it('shoud return an array', () => {
    const $ = cheerio.load(record);
    const thirdTable = $('table').first().next('table').next('table');
    const funds = collectFunds(thirdTable);
    expect(funds).to.be.an('array');
  });
  it('each arrays element shoud be { name: String, count: Number }', () => {
    const $ = cheerio.load(record);
    const thirdTable = $('table').first().next('table').next('table');
    const funds = collectFunds(thirdTable);
    funds.forEach((el) => {
      expect(el).to.include.all.keys('name', 'count');
    });
  });
  it('should return empty array if no references', () => {
    const $ = cheerio.load(record);
    const thirdTable = $('table').first().next('table');
    const funds = collectFunds(thirdTable);
    expect(funds).to.be.an('array').that.is.empty;
  });
});
