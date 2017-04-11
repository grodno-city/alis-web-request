import cheerio from 'cheerio';
import fs from 'fs';
import { expect } from 'chai';
import { getNextPageUrl } from '../index';

describe('method getNextPageUrl', () => {
  it('should exists as a public method', () => {
    expect(typeof getNextPageUrl).to.equal('function');
  });

  it('should return next page relative url', (done) => {
    const page = fs.readFileSync('./test/test.html');
    const $ = cheerio.load(page);
    const nextPageUrl = getNextPageUrl($);
    const relativeUrl = '/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&crow=1&action=10';
    expect(nextPageUrl).to.eql(relativeUrl);
    done();
  });
});
