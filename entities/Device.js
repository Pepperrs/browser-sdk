import Ajax from '../tools/ajax.js';
import Connection from '../tools/connection.js';
import {
    mqtt
}
from '../tools/mqtt';
export
default class Device {
    constructor(config) {
        this.deviceId = config.deviceId;
        this.name = config.name;
        this.model = config.model;
        this.owner = config.owner;
        this.openToPublic = config.public;
        this.ajax = new Ajax(config.ajax);
    }

    updateDevice(patch, raw) {
        if (!(this.deviceId)) {
            throw new Error('Provide the userId during instantiation');
        } else if (!(patch)) {
            throw new Error('Provide a patch of parameters to update');
        } else if (!(Object.keys(patch).length)) {
            throw new Error('Provide a patch with some parameters to update');
        }

        for (var x in patch) {
            if (!(this.hasOwnProperty(x))) {
                throw new Error('Provide a patch with relevant parameters to update');
            }
        }

        return new Promise((resolve, reject) => {
            this.ajax.patch(`/devices/${this.deviceId}`, patch, raw)
                .then((response) => {
                    this.name = response.name;
                    this.model = response.model;
                    this.owner = response.owner;
                    this.openToPublic = response.public;
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        })
    }

    deleteDevice(raw) {
        if (!(this.deviceId)) {
            throw new Error('Provide the userId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.delete(`/devices/${this.deviceId}`, null)
                .then((response) => {
                    //right now the object hangs around, but on the cloud it is gone
                    resolve(response)
                }).catch((error) => {
                    reject(error);
                });
        })
    }
    sendCommand(command, raw) {
        if (!(this.deviceId)) {
            throw new Error('Provide the deviceId during instantiation');
        } else if (!(command)) {
            throw new Error('Provide a command');
        }
        //path, name, value
        else if (!(command.path) && !(command.name) && !(command.value)) {
            throw new Error('Provide a properly formatted command');
        }

        return new Promise((resolve, reject) => {
            this.ajax.patch(`/devices/${this.deviceId}`, patch, raw)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        })
    }

    getChannel(transport) {
        return new Promise((resolve, reject) => {
            if (this._channelCredentials) {
                resolve(this._channelCredentials)
            } else {

                let body = {
                    id: this.deviceId,
                    transport: transport || "mqtt"
                }
                this.ajax.post(`/channels`, body)
                    .then((response) => {
                        this._channelCredentials = response;
                        resolve(response);
                    }).catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    connect(transport = 'mqtt') {

        let connection = new Connection();
        let getChannel = this.getChannel();
        let subscribeMqtt = new Promise((resolve, reject) => {
            let options = {
                password: this._channelCredentials.credentials.password,
                userName: this._channelCredentials.credentials.user
            }
            mqtt.subscribe(this._channelCredentials.credentials.topic, connection.event);
            mqtt.connect(options).then(() => {
                resolve(connection)
            });
        })

        return new Promise((resolve, reject) => {
            Promise.all([getChannel, subscribeMqtt]).then((all) => {
                resolve(all[1])
            });
        });
    }



    getDeviceState() {


        //     "readings": [{
        //         "path": "",
        //         "meaning": "someMeaning",
        //         "value": "30",
        //         "received": 1465394436003
        //     }],
        //     "version": {
        //         "commands": {
        //             "number": 0,
        //             "ts": 1466003661234
        //         },
        //         "configurations": {
        //             "number": 0,
        //             "ts": 1466003661234
        //         },
        //         "readings": {
        //             "number": 0,
        //             "ts": 1466003661234
        //         },
        //         "metadata": {
        //             "number": 0,
        //             "ts": 1466003661234
        //         }
        //     },
        //     "metadata": {},
        //     "configurations": [],
        //     "commands": []
        // }

        // api/devices/deviceId/state

    }

    getDeviceReadings() {
        // api/devices/deviceId/readings
    }

    getDeviceConfigurations() {
        // api/devices/deviceId/configurations
    }

    setDeviceConfigurations() {
        // api/devices/deviceId/configurations
        //POST
    }

    getDeviceCommands() {
        // api/devices/deviceId/commands
    }

    setDeviceCommands() {
        // api/devices/deviceId/commands
        //POST
    }

    getDeviceMetadata() {
        // api/devices/deviceId/metadata
    }

    setDeviceMetadata() {
        // api/devices/deviceId/metadata
        //POST
    }

    deleteDeviceMetadata() {
        // api/devices/deviceId/metadata
        //DELETE
    }
};