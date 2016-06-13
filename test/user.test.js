import User from '../entities/User.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
var expect = chai.expect;
chai.use(sinonChai);

let userInstance;
let fakeConfig;

describe('User', function() {
  beforeEach(function() {
    fakeConfig = {
      ajax: {
        url: "http://123",
        token: "123",
        tokenType: "Bears"
      }
    }

    userInstance = new User(fakeConfig);

    this.xhr = sinon.useFakeXMLHttpRequest();

    this.requests = [];

    this.xhr.onCreate = function(xhr) {
      this.requests.push(xhr);
    }.bind(this);

  });
  describe('#getUserInfo', function() {


    it('should get the current config', function() {
      expect(userInstance._getConfig()).to.deep.equal(fakeConfig);
    });

    it('should resolve a promise with user info', function(done) {
      let userStub = {
        id: "123",
        email: "john@doe",
        name: "billy"
      }

      userInstance.ajax.customXHR = this.xhr;
      userInstance.getUserInfo().then((userInfo) => {
        expect(userInfo).to.deep.equal(userStub);
        done();
      });


      this.requests[0].respond(200, {
        'Content-Type': 'text/json'
      }, JSON.stringify(userStub));
    });



  });

  describe('#getMyGroups', function() {


    it('should get the current config', function() {
      expect(userInstance._getConfig()).to.deep.equal(fakeConfig);
    });

    it('should resolve a promise with group info', function(done) {
      let groupStub =
        [{
          "owner": "9210dce8-25da-4275-a73a-1383b9774255",
          "position": 0,
          "id": "4078de7d-1769-4078-92ec-ea08e2d57f54",
          "name": "G0",
          "devices": [{
            "id": "1234dcedf-25da-427eda73a-1383b9774233",
            "name": "my device",
            "model": "MODELID",
            "firmwareVersion": "2.0",
            "secret": "123",
            "owner": "9210dce8-25da-4275-a73a-1383b9774255",
            "description": "desc",
            "public": "false",
            "externalId": "123",
            "integrationType": "relayr",
            "position": 0
          }]
        }];

      userInstance.ajax.customXHR = this.xhr;
      userInstance.getMyGroups().then((result) => {
        expect(result).to.deep.equal(groupStub);
        done();
      });


      this.requests[0].respond(200, {
        'Content-Type': 'text/json'
      }, JSON.stringify(userStub));
    });



  });
});