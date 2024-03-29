import cheerio from 'cheerio';
import { expect } from 'chai';
import { readFixture } from './fixtures.mjs';
import { getNumberedPageUrls } from '../index.mjs';

const longResultsHtml = await readFixture('long-results');

describe('getNumberedPageUrls', () => {
  it('should be a function', () => {
    expect(typeof getNumberedPageUrls).to.equal('function');
  });

  it('should accept cheerio object', () => {
    getNumberedPageUrls(cheerio.load(longResultsHtml));
  });


  it('should return ten numbered pages on long query results', () => {
    const $ = cheerio.load(longResultsHtml);
    const numberedPageUrls = getNumberedPageUrls($);
    const arrUrls = [
      'do_other.php?frow=1&fcheck=1&ccheck=1&action=1&crow=1',
      'do_other.php?frow=1&fcheck=1&ccheck=1&action=2&crow=1',
      'do_other.php?frow=1&fcheck=1&ccheck=1&action=3&crow=1',
      'do_other.php?frow=1&fcheck=1&ccheck=1&action=4&crow=1',
      'do_other.php?frow=1&fcheck=1&ccheck=1&action=5&crow=1',
      'do_other.php?frow=1&fcheck=1&ccheck=1&action=6&crow=1',
      'do_other.php?frow=1&fcheck=1&ccheck=1&action=7&crow=1',
      'do_other.php?frow=1&fcheck=1&ccheck=1&action=8&crow=1',
      'do_other.php?frow=1&fcheck=1&ccheck=1&action=9&crow=1',
      'do_other.php?frow=1&fcheck=1&ccheck=1&crow=1&action=10',
    ];
    expect(numberedPageUrls).to.eql(arrUrls);
  });

  it('should return relative URLs', () => {
    const $ = cheerio.load(longResultsHtml);
    const numberedPageUrls = getNumberedPageUrls($);
    const absoluteUrls = numberedPageUrls.filter(u => u.startsWith('http'));

    expect(numberedPageUrls.length).to.be.above(0);
    expect(numberedPageUrls.length).to.eql(10);
    expect(absoluteUrls.length).to.equal(0);
  });
});
