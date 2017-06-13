import nock from 'nock';
import { expect } from 'chai';
import { sendInitialQuery } from '../index';

describe('sendInitialQuery', () => {
  it('should be a function', () => {
    expect(typeof sendInitialQuery).to.equal('function');
  });

  it('should return first page of query results', (done) => {
    const alisEndpoint = 'http://86.57.174.45';
    const firstPageUrl = '/alis/EK/do_searh.php?radiodate=simple&valueINP=2016&tema=1&tag=6';

    nock(alisEndpoint)
      .get(firstPageUrl)
      .reply(200, '<html></html>', {
        'Set-Cookie': 'sessionalis=ra2lme8ap38rd2dt8o2dqo7vs1',
      });
    const initParams = {
      query: 2016,
      alisEndpoint: 'http://86.57.174.45',
      recordType: "Книги",
      queryType: "Год издания",
    };
    sendInitialQuery(initParams, (err, result) => {
      expect(result.page).to.equal('<html></html>');
      done();
    });
  });

  it('should set cookie in jar', (done) => {
    const alisEndpoint = 'http://86.57.174.45';
    const firstPageUrl = '/alis/EK/do_searh.php?radiodate=simple&valueINP=2016&tema=1&tag=6';

    nock(alisEndpoint)
      .get(firstPageUrl)
      .reply(200, '<html></html>', {
        'Set-Cookie': 'sessionalis=ra2lme8ap38rd2dt8o2dqo7vs1',
      });
    const initParams = {
      query: 2016,
      alisEndpoint: 'http://86.57.174.45',
      recordType: "Книги",
      queryType: "Год издания",
    };
    sendInitialQuery(initParams, (err, result) => {
      const cookies = result.jar.getCookieString(`${alisEndpoint}${firstPageUrl}`).replace('=', ' ').split(' ');
      const key = 'sessionalis';
      const value = 'ra2lme8ap38rd2dt8o2dqo7vs1';
      expect(cookies[0]).to.equal(key);
      expect(cookies[1]).to.equal(value);
      done();
    });
  });
  it('should error when alisEndpoint is not provided', (done) => {
    const initParams = {
      query:2016,
      recordType: "Книги",
      queryType: "Год издания",
    };
    sendInitialQuery(initParams, (err) => {
      expect(err.message).to.equal('alisEndpoint is not provided');
      done();
    });
  });
  it('should error when query string is not provided', (done) => {
    const initParams = {
      alisEndpoint: 'http://86.57.174.45',
      recordType: "Книги",
      queryType: "Год издания",
    };
    sendInitialQuery(initParams, (err) => {
      expect(err.message).to.equal('query string is not provided');
      done();
    });
  });
  it('should error when queryType string is not provided', (done) => {
    const initParams = {
      query: 2016,
      alisEndpoint: 'http://86.57.174.45',
      recordType: "Книги",
    };
    sendInitialQuery(initParams, (err) => {
      expect(err.message).to.equal('queryType string is not provided');
      done();
    });
  });
  it('should error when recordType string is not provided', (done) => {
    const initParams = {
      query: 2016,
      alisEndpoint: 'http://86.57.174.45',
      queryType: "Год издания",
    };
    sendInitialQuery(initParams, (err) => {
      expect(err.message).to.equal('recordType string is not provided');
      done();
    });
  });
});
