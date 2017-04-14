import cheerio from 'cheerio';
import fs from 'fs';
import { expect } from 'chai';
import { join } from 'path';
import { getNumberedPageUrls } from '../index';

const longResultsHtml = fs.readFileSync(join(__dirname, './fixtures/long-results.html'));

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
    const absoluteUrls = numberedPageUrls.map(u => u.startsWith('http'));

    expect(numberedPageUrls.length).to.be.above(0);
    expect(absoluteUrls[0]).to.equal(false);
  });
});
