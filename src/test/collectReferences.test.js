import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { collectReferences } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/recordWithYears.html'));

describe('collectReferences', () => {
  it('should be a function', () => {
    expect(typeof collectReferences).to.equal('function');
  });

  it('shoud return an array', () => {
    const $ = cheerio.load(record);
    const thirdTable = $('table').first().next('table').next('table');
    const references = collectReferences(thirdTable);
    expect(references).to.be.an('array');
  });
  it('each arrays element shoud be { tag: Number, value: String }', () => {
    const $ = cheerio.load(record);
    const thirdTable = $('table').first().next('table').next('table');
    const references = collectReferences(thirdTable);
    references.forEach((el) => {
      expect(el).to.include.all.keys('tag', 'value');
    });
  });
});
