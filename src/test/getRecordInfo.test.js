import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { getRecordInfo } from '../index';

const recordWithYears = fs.readFileSync(join(__dirname, 'fixtures/recordWithYears.html'));
const recordWithFunds = fs.readFileSync(join(__dirname, 'fixtures/recordWithFunds.html'));

describe('getRecordInfo', () => {
  it('should be a function', () => {
    expect(typeof getRecordInfo).to.equal('function');
  });

  it('shoud return an object with years', () => {
    const $ = cheerio.load(recordWithYears);
    const recordWithYearsInfo = getRecordInfo($);
    expect(recordWithYearsInfo).to.deep.equal({
      belmarcId: 'BY-HR0000-br28392',
      fields: [
        { tag: 'Каталожный номер', value: '84' },
        { tag: 'Основное заглавие', value: 'Знамя' },
        { tag: 'Сведения,относящиеся к заглавию',
          value: 'ежемес. лит.-худож. и обществ.-полит. журн.' },
        { tag: 'Первые сведения об ответствен.',
          value: 'гл. ред. С.Чупринин' },
        { tag: '2-е и послед.свед.об ответстве',
          value: 'учредитель: Труд. коллектив ред. журн.' },
        { tag: 'Первое место издания', value: 'М.' },
        { tag: 'Дата издания,распространения', value: '2000' },
        { tag: 'Примечание', value: 'Янв. 1931 г.' },
        { tag: 'ISSN', value: '0130-1616' },
        { tag: 'Индекс ББК', value: '84' },
      ],
      years: [
        2000,
        2001,
        2002,
        2003,
        2004,
        2005,
        2006,
        2007,
        2008,
        2009,
        2010,
        2011,
      ],
      references: [
        { tag: 2, value: 'гл. ред. С.Чупринин ' },
        { tag: 2, value: 'учредитель: Труд. коллектив ред. журн. ' },
      ],
    });
  });
  it('shoud return an object with funds', () => {
    const $ = cheerio.load(recordWithFunds);
    const recordWithFundsInfo = getRecordInfo($);
    expect(recordWithFundsInfo).to.deep.equal({
      belmarcId: 'BY-HR0000-br21989',
      fields: [
        { tag: 'Авторский знак', value: 'М 29' },
        { tag: 'Автор', value: 'Мартынов, В. Ф.' },
        { tag: 'Заглавие', value: 'Философия красоты' },
        { tag: 'Место издания', value: 'Минск' },
        { tag: 'Издательство', value: 'ТетраСистемс' },
        { tag: 'Год издания', value: '1999' },
        { tag: 'Обьем', value: '333 с.' },
        { tag: ' ББК ', value: '87.811' },
        { tag: 'Язык документа', value: 'rus' },
      ],
      funds: [
        { name: 'Искусство,фондир.,групповая. .', count: 1 },
        { name: 'Искусство,фондир.,стандарт.***', count: 1 },
        { name: 'Книгохранение,фондир.,стандарт.', count: 1 },
      ],
      references: [
        { tag: 2, value: 'Мартынов, В. Ф.' },
        { tag: 4, value: 'КРАСОТА ' },
        { tag: 4, value: 'ФИЛОСОФИЯ ' },
        { tag: 4, value: 'ЭСТЕТИКА ' },
        { tag: 4, value: 'прекрасное ' },
      ],
    });
  });
});
