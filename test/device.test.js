import Device from '../entities/Device.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
var expect = chai.expect;
chai.use(sinonChai);

let deviceInstance;

describe('Device', function() {
    beforeEach(function() {
        let options = {

        };
        deviceInstance = new Device(options);
    });

    describe('#getDevice', function() {
        beforeEach(function() {
            sinon.spy(deviceInstance, '_ajax');
        });

        it('should throw an error if no deviceId given to look up', function() {
            deviceInstance.deviceId = null;
            var fn = function() {
                deviceInstance.getDevice();
            };
            expect(fn).to.throw(Error);
        });

        it('should call _ajax with the right structure')
    });
});

//  getDevice
// getDeviceState
// getAllDevices
// sendCommand

// expect(deviceInstance._loginRedirect).to.have.been.calledWith('https://api.relayr.io/oauth2/auth?client_id=fakeAppId&redirect_uri=fakeURI&response_type=token&scope=access-own-user-info+configure-devices');