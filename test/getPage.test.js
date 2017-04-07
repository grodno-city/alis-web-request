import nock from 'nock';
import { expect } from 'chai';
import { getPage } from '../index';

describe('method getPage', () => {
  it('should exists as a public method', () => {
    expect(typeof getPage).to.equal('function');
  });

  it('should makes http call to alis library and return html string', (done) => {
    const origin = 'http://86.57.174.45';
    const resource = '/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&action=2&crow=1';
    nock(origin)
        .get(resource)
        .reply(200, '<html></html>');

    const initParams = {
      url: `${origin}${resource}`,
      jar: 'cookie',
    };

    getPage(initParams, (err, data) => {
      expect(data).to.equal('<html></html>');
      done();
    });
  });
});
