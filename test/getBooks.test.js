import cheerio from 'cheerio';
import fs from 'fs';
import { expect } from 'chai';
import { getBooks } from '../index';

describe('method getBooks', () => {
  it('should exists as a public method', (done) => {
    expect(typeof getBooks).to.equal('function');
    done();
  });

  it('should return books', (done) => {
    const page = fs.readFileSync('./test/test.html');
    const $ = cheerio.load(page);
    const books = $('.article');
    expect(getBooks($)).to.eql(books);
    done();
  });
});
