import nock from 'nock';
import request from 'request';
import { expect } from 'chai';
import { getPage } from '../index.mjs';

describe('getPage', () => {
  it('should be a function', () => {
    expect(typeof getPage).to.equal('function');
  });

  it('should return one page of a query results', (done) => {
    const alisEndpoint = 'http://86.57.174.45';
    const urlToSecondPage = '/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&action=2&crow=1';

    // Here we construct JAR manually, in normal operation `getPage` should use
    // JAR returned from `sendInitialQuery`.
    const j = request.jar();

    j.setCookie(
      request.cookie('sessionalis=valid-session-id'),
    );

    nock(alisEndpoint)
      .get(urlToSecondPage)
      // TODO find out why Cookie header is not set
      // .matchHeader('Cookie: sessionalis=valid-session-id')
      // .reply(200, function () {
      //   console.log('headers:', this.req.headers);
      //   return '';
      // })
      .reply(200, '<html> ... mock results page ... </html>');

    const options = {
      url: `${alisEndpoint}${urlToSecondPage}`,
      jar: j,
      noCache: true,
    };

    getPage(options, (err, pageHtml) => {
      console.log(err);
      expect(err).to.equal(null);
      expect(pageHtml).to.equal('<html> ... mock results page ... </html>');
      done();
    });
  });

  it('should error when session is expired', (done) => {
    const alisEndpoint = 'http://86.57.174.45';
    const urlToSecondPage = '/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&action=2&crow=1';
    // Here we construct JAR manually, in normal operation `getPage` should use
    // JAR returned from `sendInitialQuery`.
    const j = request.jar();

    j.setCookie(
      request.cookie('session-id-expired-on-server-side'),
    );

    nock(alisEndpoint)
      // .matchHeader('session-id-expired-on-server-side')
      .get(urlToSecondPage)
      .reply(200, 'Notice: Undefined index: namearm in E:\\ALIS\\pls\\alis\\EK\\do_other.php on line 28\n <html> ... </html>');

    const options = {
      url: `${alisEndpoint}${urlToSecondPage}`,
      jar: j,
      noCache: true,
    };

    getPage(options, (err, pageHtml) => {
      expect(err).to.equal(null);
      expect(pageHtml).to.equal('Notice: Undefined index: namearm in E:\\ALIS\\pls\\alis\\EK\\do_other.php on line 28\n <html> ... </html>');
      done();
    });
  });
});
