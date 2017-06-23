import cheerio from 'cheerio';
import fs from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { getRecordInfo } from '../index';

const record = fs.readFileSync(join(__dirname, 'fixtures/recordInfo.html'));

describe('getRecordInfo', () => {
  it('should be a function', () => {
    expect(typeof getRecordInfo).to.equal('function');
  });

  it('should not consist "Название" key', () => {
    const $ = cheerio.load(record);
    expect(getRecordInfo($)).to.not.have.keys('Название');
  })

  it('should collect string with "фондир" in "Фонд" field', () => {
    const $ = cheerio.load(record);
    const info = getRecordInfo($);
    expect(info['Фонд']).to.be.an('object');
    const keys = Object.keys(info);
    const result = keys.every(el => el.match('фондир'));
    expect(result).to.equal(false);
  });
  it('should collect refs on other library records in tags field ', () => {
    const $ = cheerio.load(record);
    const info = getRecordInfo($);
    expect(info.tags).to.be.an('array');
  });
  it('should parse ISBN string if it consist more than 1 code', () => {
    const $ = cheerio.load(record);
    const info = getRecordInfo($);
    expect(info.ISBN).to.be.an('array');
  });
  it('should split tag string if it consist *', () => {
    const $ = cheerio.load(record);
    const info = getRecordInfo($);
    const result = info.tags.every(el => el.match(/\*/));
    expect(result).to.equal(false);
  });
  it('should concat splited string with tags array', () => {
    const $ = cheerio.load(record);
    const info = getRecordInfo($);
    expect(info.tags.length).to.equal(5);
  });
  it('should put data with empty key in unknown fiels', () => {
    const $ = cheerio.load(record);
    const info = getRecordInfo($);
    expect(info.unknown.length).to.equal(1);
  });
  it('should remove " ." from all field', () => {
    const $ = cheerio.load(record);
    const info = getRecordInfo($);
    expect(info['Сведения,относящиеся к заглавию']).to.be.a('string');
    expect(info['Первые сведения об ответствен.']).to.equal('Фридрих Незнанский');
  });
});
