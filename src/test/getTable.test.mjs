import cheerio from 'cheerio';
import { expect } from 'chai';
import { readFixture } from './fixtures.mjs';
import { getTable } from '../index.mjs';

const record = await readFixture('recordWithYears');

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
