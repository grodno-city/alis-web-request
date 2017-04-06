const AlisWebRequest = require('../index');
const chai = require('chai');
const nock = require('nock');
const expect = chai.expect;

describe('AlisWebRequest', function () {
  describe('method sendInitialQuery', function () {

    it("exists as a public method on AlisWebRequest", function () {
      expect(typeof AlisWebRequest.sendInitialQuery).to.equal('function');
    });

    it("makes the correct http call to Alis library based on the parameters it's passed", function () {

      nock('http://86.57.174.45/pls/alis/StartEK/do_searh.php?radiodate=simple&valueINP=2016&tema=1&tag=6')
        .get('/')
        .reply(200, { page: 'some_value', jar: 'some_value' });

      AlisWebRequest.sendInitialQuery({ year: 2016, ip: '86.57.174.45'}, function (err, data) {
        expect(data).to.equal({ page: 'some_value', jar: 'some_value' });
      });
    })
  });

  describe('method getPage', function () {

    it("exists as a public method on AlisWebRequest", function () {
      expect(typeof AlisWebRequest.getPage).to.equal('function');
    });

    it("makes the correct http call to library based on the parameters it's passed", function () {
      nock('http://86.57.174.45/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&action=2&crow=1')
        .get('/')
        .reply(200, { body:'some_value'});

      const initParams = {
        url: 'http://86.57.174.45/alis/EK/do_other.php?frow=1&fcheck=1&ccheck=1&action=2&crow=1',
        jar: 'some_value'
      };

      AlisWebRequest.getPage(initParams, function (err, data) {
        expect(data).to.equal({ body:'some_value'});
      });
    })
  })
});
