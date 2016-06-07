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
            deviceId: 'fakeDeviceId',
            userId: 'fakeUserId'
        };

        deviceInstance = new Device(options);
    });

    describe('#getDeviceData', function() {
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

        it('should call _ajax with the right structure', function() {
            deviceInstance.getDeviceData();
            expect(deviceInstance._ajax).to.have.been.calledWith(sinon.match('devices/fakeDeviceId'), sinon.match('GET'));
        });
    });
});

//  getDevice
// getDeviceState
// getAllDevices
// sendCommand