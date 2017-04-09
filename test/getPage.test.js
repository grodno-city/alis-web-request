import nock from 'nock';
import { expect } from 'chai';
import { getPage } from '../index';

describe('method getPage', () => {
  it('should exists as a public method', (done) => {
    expect(typeof getPage).to.equal('function');
    done();
  });

  it('should makes http call to alis library and return html string', (done) => {
    const origin = 'http://86.57.174.45';
    const resource = '/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&action=2&crow=1';
    nock(origin)
      .get(resource)
      .reply(200, '<html></html>');

    const url = `${origin}${resource}`;
    const jar = 'sessionalis=ra2lme8ap38rd2dt8o2dqo7vs1';

    getPage(url, jar, (err, data) => {
      expect(data).to.equal('<html></html>');
      done();
    });
  });
});
