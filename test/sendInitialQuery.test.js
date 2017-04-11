import nock from 'nock';
import { expect } from 'chai';
import { sendInitialQuery } from '../index';

describe('method sendInitialQuery', () => {
  it('should exists as a public method', () => {
    expect(typeof sendInitialQuery).to.equal('function');
  });

  it('should makes http call to alis library and return html string and set cookie in jar', (done) => {
    const origin = 'http://86.57.174.45';
    const resource = '/alis/EK/do_searh.php?radiodate=simple&valueINP=2016&tema=1&tag=6';
    const cookiesString = 'sessionid=38afes7a7';

    nock(origin)
      .get(resource)
      .reply(200, '<html></html>', {
        'Set-Cookie': 'sessionid=38afes7a7',
      });

    sendInitialQuery({ year: 2016, ip: '86.57.174.45' }, (err, data) => {
      const cookies = data.jar.getCookieString(`${origin}${resource}`);
      expect(data.page).to.equal('<html></html>');
      expect(cookies).to.equal(cookiesString);
      done();
    });
  });
});
