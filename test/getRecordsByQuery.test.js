import nock from 'nock';
import { expect } from 'chai';
import { getRecordsByQuery } from '../index';

describe('getRecordsByQuery', () => {
  it('should be a function', () => {
    expect(typeof getRecordsByQuery).to.equal('function');
  });
  it('return error if no results', (done) => {
    const initParams = {
      query: 'wrong query',
      alisEndpoint: 'http://86.57.174.45',
      recordType: 'Книги',
      queryType: 'Год издания',
    };
    const alisEndpoint = 'http://86.57.174.45';
    const firstPageUrl = '/alis/EK/do_searh.php?radiodate=simple&valueINP=wrong%2520query&tema=1&tag=6';

    nock(alisEndpoint)
      .get(firstPageUrl)
      .reply(200, '<html> Не результативный поиск</html>', {
        'Set-Cookie': 'sessionalis=ra2lme8ap38rd2dt8o2dqo7vs1',
      });
    getRecordsByQuery(initParams, (err, memo) => {
      expect(err.message).to.equal('no match');
      done();
    });
  });
});
