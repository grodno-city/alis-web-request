import cheerio from 'cheerio';
import fs from 'fs';
import { expect } from 'chai';
import { getNumberedPageUrls } from '../index';

describe('getNumberedPageUrls, () => {}', () => {
  it('should be a function', () => {
    expect(typeof getNumberedPageUrls).to.equal('function');
  });

  it('should return nine numbered pages on long query results', () => {
  });

  it('should return relative URLs', () => {
    // TODO read from proper fixture
    const page = fs.readFileSync('./test/test.html');
    const $ = cheerio.load(page);

    const numberedPageUrls = getNumberedPageUrls($);
    const absoluteUrls = numberedPageUrls.find(u => u.startsWith('http');

    expect(numberedPageUrls).to.be.above(0);
    expect(absoluteUrls).to.equal(0);
  });
});
