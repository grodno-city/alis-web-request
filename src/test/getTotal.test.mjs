import cheerio from 'cheerio';
import { expect } from 'chai';
import { readFixture } from './fixtures.mjs';
import { getTotal } from '../index.mjs';

const shortResultsHtml = await readFixture('short-results');
const longResultsHtml = await readFixture('long-results');

describe('getTotal', () => {
  it('should be a function', () => {
    expect(typeof getTotal).to.equal('function');
  });

  it('should accept cheerio object', () => {
    getTotal(cheerio.load(longResultsHtml));
  });

  it('should return total which is more than 20 on multi-page results', () => {
    const $ = cheerio.load(longResultsHtml);
    const totalResult = getTotal($);

    expect(totalResult).to.be.above(9 * 20);
  });

  it('should return total result to be above 1, when there is one pages', () => {
    const $ = cheerio.load(shortResultsHtml);
    const totalResult = getTotal($);

    expect(totalResult).to.be.at.least(1);
  });
});
