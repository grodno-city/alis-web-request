import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { getTotalResult } from '../index';

const shortResultsHtml = fs.readFileSync(join(__dirname, './fixtures/short-results.html'));
const longResultsHtml = fs.readFileSync(join(__dirname, './fixtures/long-results.html'));

describe('getTotalResult', () => {
  it('should be a function', () => {
    expect(typeof getTotalResult).to.equal('function');
  });

  it('should accept cheerio object', () => {
    getTotalResult(cheerio.load(longResultsHtml));
  });

  it('should return total result to be above 180, when there is more than 9 pages', () => {
    const $ = cheerio.load(longResultsHtml);
    const totalResult = getTotalResult($);

    expect(totalResult).to.be.above(9 * 20);
  });

  it('should return total result to be above 1, when there is one pages', () => {
    const $ = cheerio.load(shortResultsHtml);
    const totalResult = getTotalResult($);

    expect(totalResult).to.be.at.least(1);
  });
});
