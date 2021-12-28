import nock from 'nock';
import { expect } from 'chai';
import { getRecordByID } from '../index.mjs';

describe('getRecordByID', () => {
  it('should be a function', () => {
    expect(typeof getRecordByID).to.equal('function');
  });
  it('return error if record not found', (done) => {
    const alisEndpoint = 'http://86.57.174.45';
    const id = '0';
    const firstPageUrl = `/alis/EK/do_view.php?id=${id}`;

    nock(alisEndpoint)
      .get(firstPageUrl)
      .reply(200, '<html> Undefined variable </html>');

    getRecordByID(alisEndpoint, id, (err, info) => {
      expect(err.message).to.equal('Record not found');
      done();
    });
  });
});
