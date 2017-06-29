import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { collectReferences, getTable } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/recordWithYears.html'));

describe('collectReferences', () => {
  it('should be a function', () => {
    expect(typeof collectReferences).to.equal('function');
  });

  it('shoud return an array', () => {
    const $ = cheerio.load(record);
    const referencesTable = getTable($, 'references');
    const references = collectReferences(referencesTable);
    expect(references).to.be.an('array');
  });
  it('each arrays element shoud be { tag: Number, value: String }', () => {
    const $ = cheerio.load(record);
    const referencesTable = getTable($, 'references');
    const references = collectReferences(referencesTable);
    references.forEach((el) => {
      expect(el).to.include.all.keys('tag', 'value');
    });
  });
});
