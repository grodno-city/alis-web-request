import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { collectFields } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/recordWithYears.html'));

describe('collectFields', () => {
  it('should be a function', () => {
    expect(typeof collectFields).to.equal('function');
  });

  it('shoud return an array', () => {
    const $ = cheerio.load(record);
    const firstTable = $('table').first();
    const funds = collectFields(firstTable);
    expect(funds).to.be.an('array');
  });
  it('each arrays element shoud be { name: String, count: Number }', () => {
    const $ = cheerio.load(record);
    const firstTable = $('table').first();
    const funds = collectFields(firstTable);
    funds.forEach((el) => {
      expect(el).to.include.all.keys('tag', 'value');
    });
  });
});
