import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { getTotal, getItems } from '../src/index';

const shortResultsHtml = fs.readFileSync(join(__dirname, 'fixtures/short-results.html'));
const longResultsHtml = fs.readFileSync(join(__dirname, 'fixtures/long-results.html'));

describe('getItems', () => {
  it('should be a function', () => {
    expect(typeof getItems).to.equal('function');
  });

  it('should accept cheerio object', () => {
    getItems(cheerio.load(shortResultsHtml));
  });

  it('should parse item id', () => {
    const items = getItems(cheerio.load(shortResultsHtml));
    expect(items[0].id).to.be.a('string');
  });

  it('should parse item title', () => {
    const items = getItems(cheerio.load(shortResultsHtml));
    expect(items[0].title).to.be.a('string');
    expect(items[0].title).to.equal('Александров, О. А. Логистика : учебное пособие / О. А. Александров. - Москва : Инфра-М, 2017. - 215, [1] с.. - (Высшее образование — бакалавриат) ББК 65.291.592я73');
  });

  it('should return 20 items when there are 20 or more items in query results', () => {
    const $ = cheerio.load(longResultsHtml);
    const total = getTotal($);
    const items = getItems($);

    expect(total).to.be.at.least(20);
    expect(items.length).to.equal(20);
  });

  it('should return less than 20 items when there are less than 20 items in query results', () => {
    const $ = cheerio.load(shortResultsHtml);
    const total = getTotal($);
    const items = getItems($);

    expect(total).to.be.below(20);
    expect(items.length).to.be.at.least(total);
  });
});
