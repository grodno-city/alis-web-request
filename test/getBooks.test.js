import cheerio from 'cheerio';
import fs from 'fs';
import { expect } from 'chai';
import { getBooks } from '../index';

describe('method getBooks', () => {
  it('should exists as a public method', () => {
    expect(typeof getBooks).to.equal('function');
  });

  it('should return title of book', (done) => {
    const page = fs.readFileSync('./test/test.html');
    const $ = cheerio.load(page);
    const book = getBooks($);
    const title = 'Black, K. Игрушки-мультяшки от Katrin Black : мастер-классы и выкройки / [Katrin Black]. - Санкт-Петербург ';
    expect(book[0]).to.eql(title);
    done();
  });
});
