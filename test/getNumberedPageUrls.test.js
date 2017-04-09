import cheerio from 'cheerio';
import fs from 'fs';
import { expect } from 'chai';
import { getNumberedPageUrls } from '../index';

describe('method getNumberedPageUrls', () => {
  it('should exists as a public method', (done) => {
    expect(typeof getNumberedPageUrls).to.equal('function');
    done();
  });

  it('should return array urls', (done) => {
    const page = fs.readFileSync('./test/test.html');
    const ip = '86.57.174.45';
    const $ = cheerio.load(page);
    const pageLinks = $('a[href^=\'do_other\']');
    const pageUrls = $(pageLinks).map((i, link) => `http://${ip}/alis/EK/${$(link).attr('href')}`).toArray();
    expect(getNumberedPageUrls(page, ip)).to.eql(pageUrls);
    done();
  });
});
