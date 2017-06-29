import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { getTable } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/recordWithYears.html'));

describe('getTable', () => {
  it('should be a function', () => {
    expect(typeof getTable).to.equal('function');
  });

  it('shoud return table with title "Название"', () => {
    const $ = cheerio.load(record);
    const fieldsTable = getTable($, 'fields');
    const title = $('tr:nth-child(1) th:nth-child(1)', fieldsTable).text();
    expect(title).to.equal('Название');
  });
});
