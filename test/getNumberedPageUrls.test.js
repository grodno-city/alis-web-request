import cheerio from 'cheerio';
import fs from 'fs';
import { expect } from 'chai';
import { getNumberedPageUrls } from '../index';

describe('getNumberedPageUrls, () => {}', () => {
  it('should be a function', () => {
    expect(typeof getNumberedPageUrls).to.equal('function');
  });

  it('should return array urls', () => {
    const page = fs.readFileSync('./test/test.html');
    const $ = cheerio.load(page);
    const ip = '86.57.174.45';
    const numberedPageUrls = getNumberedPageUrls($, ip);
    const arrUrls = [
      'http://86.57.174.45/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&action=1&crow=1',
      'http://86.57.174.45/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&action=2&crow=1',
    ];
    expect(numberedPageUrls).to.eql(arrUrls);
  });
});
