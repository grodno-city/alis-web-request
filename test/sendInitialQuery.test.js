import nock from 'nock';
import { expect } from 'chai';
import { sendInitialQuery } from '../index';

describe('method sendInitialQuery', () => {
  it('should exists as a public method', (done) => {
    expect(typeof sendInitialQuery).to.equal('function');
    done();
  });

  it('should makes http call to alis library and return html string with jar object', (done) => {
    const origin = 'http://86.57.174.45';
    const resource = '/alis/EK/do_searh.php?radiodate=simple&valueINP=2016&tema=1&tag=6';
    nock(origin)
      .get(resource)
      .reply(200, '<html></html>');

    sendInitialQuery({ year: 2016, ip: '86.57.174.45' }, (err, data) => {
      expect(data.page).to.equal('<html></html>');
      expect(typeof data.jar).to.equal('object');
      done();
    });
  });
});
