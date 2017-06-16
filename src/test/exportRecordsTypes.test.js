import { recordTypes } from '../index';
import { expect } from 'chai';

describe('export recordTypes', () => {
  it('should be an object', () => {
    expect(recordTypes).to.be.an('object');
  });
})
