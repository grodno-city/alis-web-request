import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { getTotalItems } from '../index';

const shortResultsHtml = fs.readFileSync(join(__dirname, './fixtures/short-results.html'));
const longResultsHtml = fs.readFileSync(join(__dirname, './fixtures/long-results.html'));

describe('getTotalItems', () => {
  it('should be a function', () => {
    expect(typeof getTotalItems).to.equal('function');
  });

  it('should accept cheerio object', () => {
    getTotalItems(cheerio.load(shortResultsHtml));
  });

  it('should return total items to be at least 20, when there are 20 items in query results', () => {
    const $ = cheerio.load(longResultsHtml);
    const totalItems = getTotalItems($);

    expect(totalItems).to.be.at.least(20);
  });

  it('should return total items  to be below 20, when there are less than 20 items in query results', () => {
    const $ = cheerio.load(shortResultsHtml);
    const totalItems = getTotalItems($);

    expect(totalItems).to.be.below(20);
  });
});
