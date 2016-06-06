export
default class Device {
    constructor(id) {
        this.deviceId = id;
        // this.height = height;
        // this.width = width;
    }






    getDeviceData() {
        let self = this;
        if (!(self.deviceId)) {
            throw new Error('Provide the deviceId during instantiation');
        }
        return new Promise(function(resolve, reject) {
            some.library({
                url: self.config.url + 'devices/' + self.deviceId,
                type: 'GET',
                token: 'Bearer ' + something.token,
                isObject: true
            }, function(device) {
                resolve(device);
            }, function(error) {
                reject(error);
            });
        });
    };
};

// getDeviceState
// getAllDevices
// sendCommand