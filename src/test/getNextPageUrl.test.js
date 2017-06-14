import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { getNextPageUrl, getTotal } from '../index';

const shortResultsHtml = fs.readFileSync(join(__dirname, 'fixtures/short-results.html'));
const longResultsHtml = fs.readFileSync(join(__dirname, 'fixtures/long-results.html'));

describe('getNextPageUrl', () => {
  it('should be a function', () => {
    expect(typeof getNextPageUrl).to.equal('function');
  });

  it('should accept cheerio object', () => {
    getNextPageUrl(cheerio.load(shortResultsHtml));
  });

  it('should return relative URL of the next page when there is more than 9 pages', () => {
    const $ = cheerio.load(longResultsHtml);
    const total = getTotal($);
    const nextPageUrl = getNextPageUrl($);

    expect(total).to.be.above(9 * 20);
    expect(nextPageUrl).to.eql('do_other.php?frow=1&fcheck=1&ccheck=1&crow=1&action=10');
  });

  it('should return undefined when there is less than 9 pages', () => {
    const $ = cheerio.load(shortResultsHtml);
    const total = getTotal($);
    const nextPageUrl = getNextPageUrl($);

    expect(total).to.be.at.most(9 * 20);
    expect(nextPageUrl).to.eql(undefined);
  });
});
