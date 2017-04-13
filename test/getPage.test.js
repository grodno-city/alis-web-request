import nock from 'nock';
import request from 'request';
import { expect } from 'chai';
import { getPage } from '../index';

describe('getPage, () => {}', () => {
  it('should be a function', () => {
    expect(typeof getPage).to.equal('function');
  });

  it('should return html string', (done) => {
    const origin = 'http://86.57.174.45';
    const resource = '/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&action=2&crow=1';
    const j = request.jar();

    j.setCookie(
      request.cookie('sessionalis=ra2lme8ap38rd2dt8o2dqo7vs1'),
    );

    nock(origin)
      .matchHeader('Cookie: sessionalis=ra2lme8ap38rd2dt8o2dqo7vs1')
      .get(resource)
      .reply(200, '<html></html>');

    const options = {
      url: `${origin}${resource}`,
      jar: j,
    };

    getPage(options, (err, data) => {
      expect(data).to.equal('<html></html>');
      done();
    });
  });
});
