import nock from 'nock';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Query from '../Query.mjs';

chai.use(chaiAsPromised);

describe('Query', () => {
  it('should error if no results', async () => {
    const initParams = {
      query: 'wrong query',
      alisEndpoint: 'http://86.57.174.45',
      recordType: 'Книги',
      queryType: 'Год издания',
    };
    const alisEndpoint = 'http://86.57.174.45';
    const firstPageUrl = '/alis/EK/do_searh.php?radiodate=simple&valueINP=wrong%20query&tema=1&tag=6';

    nock(alisEndpoint)
      .get(firstPageUrl)
      .reply(200, '<html>...<title>Не результативный поиск</title>...</html>', {
        'Set-Cookie': 'sessionalis=ra2lme8ap38rd2dt8o2dqo7vs1',
      });

    const query = new Query(initParams);

    expect(query.send()).to.eventually.throw(Error, 'no match');
  });
});
