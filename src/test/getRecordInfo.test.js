import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { getRecordInfo } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/record.html'));

describe('getRecordInfo', () => {
  it('should be a function', () => {
    expect(typeof getRecordInfo).to.equal('function');
  });

  it('shoud return an object', () => {
    const $ = cheerio.load(record);
    const info = getRecordInfo($);
    info.id = 28392;
    expect(info).to.deep.equal({
      belMarkId: 'ID= BY-HR0000-br28392',
      tags: [
        { tag: 'Каталожный номер', field: '84' },
        { tag: 'Основное заглавие', field: 'Знамя' },
        { tag: 'Сведения,относящиеся к заглавию',
          field: 'ежемес. лит.-худож. и обществ.-полит. журн.' },
        { tag: 'Первые сведения об ответствен.',
          field: 'гл. ред. С.Чупринин' },
        { tag: '2-е и послед.свед.об ответстве',
          field: 'учредитель: Труд. коллектив ред. журн.' },
        { tag: 'Первое место издания', field: 'М.' },
        { tag: 'Дата издания,распространения', field: '2000' },
        { tag: 'Примечание', field: 'Янв. 1931 г.' },
        { tag: 'ISSN', field: '0130-1616' },
        { tag: 'Индекс ББК', field: '84' },
      ],
      years: [
        '2000',
        '2001',
        '2002',
        '2003',
        '2004',
        '2005',
        '2006',
        '2007',
        '2008',
        '2009',
        '2010',
        '2011',
      ],
      references: [
        { tag: '2', value: 'гл. ред. С.Чупринин ' },
        { tag: '2', value: 'учредитель: Труд. коллектив ред. журн. ' },
      ],
      id: 28392,
    });
  });
});
