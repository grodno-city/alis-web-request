import cheerio from 'cheerio';
import fs from 'fs';
import { expect } from 'chai';
import { getNextPageUrl } from '../index';

describe('method getNextPageUrl', () => {
  it('should exists as a public method', (done) => {
    expect(typeof getNextPageUrl).to.equal('function');
    done();
  });

  it('should return next url', (done) => {
    const page = fs.readFileSync('./test/test.html');
    const $ = cheerio.load(page);
    const pageLink = $('#Agt');
    const pageUrl = (`${$(pageLink).attr('href')}`);
    expect(getNextPageUrl($)).to.eql(pageUrl);
    done();
  });
});
