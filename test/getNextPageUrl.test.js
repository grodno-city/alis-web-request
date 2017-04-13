import cheerio from 'cheerio';
import fs from 'fs';
import { expect } from 'chai';
import { getNextPageUrl } from '../index';

describe('getNextPageUrl', () => {
  it('should be a function', () => {
    expect(typeof getNextPageUrl).to.equal('function');
  });

  it('should return relative URL of the next page when there is more than 9 pages', () => {
    const page = fs.readFileSync('./test/test.html');
    const $ = cheerio.load(page);
    const nextPageUrl = getNextPageUrl($);

    expect(total).to.be.above(9 * 20);
    expect(nextPageUrl).to.eql('/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&crow=1&action=10');
  });

  it('should ... when there is less than 10 pages', () => {
    // TODO

    expect(total).to.be.at.most(9 * 20);
    expect(nextPageUrl).to.be(undefined);
  });
});
