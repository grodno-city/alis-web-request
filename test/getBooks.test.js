import cheerio from 'cheerio';
import fs from 'fs';
import { expect } from 'chai';
import { getBooks } from '../index';

describe('getBooks, () => {}', () => {
  it('should be a function', () => {
    expect(typeof getBooks).to.equal('function');
  });

  it('should get titles of books', () => {
    const page = fs.readFileSync('./test/test.html');
    const $ = cheerio.load(page);

    expect(getBooks($).map(el => el)).to.eql([
      'Black, K. Игрушки-мультяшки от Katrin Black : мастер-классы и выкройки / [Katrin Black]. - Санкт-Петербург ',
      'Black, K. Игрушки-мультяшки от Katrin Black : мастер-классы и выкройки / [Katrin Black]. - Санкт-Петербург ',
    ],
    );
  });
});
