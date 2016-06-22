import Ajax from '../tools/ajax.js';
import Connection from '../tools/connection.js';
import DeviceHistory from './history/DeviceHistory';
import {
    mqtt
}
from '../tools/mqtt';

import Model from '../entities/Model';

let sharedChannel = null;

export
default class Device {
    constructor(rawDevice = {}, config) {
        this.rawDevice = rawDevice;
        this.config = config;

        this.id = rawDevice.id;
        this.name = rawDevice.name;
        this.modelId = rawDevice.modelId;
        this.model = new Model(this.modelId, config);
        this.description = rawDevice.description;
        this.owner = rawDevice.owner;
        this.openToPublic = rawDevice.public;
        this.ajax = new Ajax(config.ajax);
        this.history = new DeviceHistory(rawDevice, config);
        this.configurations = [];
        this.commands = [];
        this.metadata = {}
    }

    updateDevice(patch, raw) {
        if (!(this.id)) {
            throw new Error('Provide the device id during instantiation');
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
            this.ajax.patch(`/devices/${this.id}`, patch, {
                raw: raw
            })
                .then((response) => {
                    this.name = response.name;
                    this.modelId = response.modelId;
                    this.owner = response.owner;
                    this.openToPublic = response.public;
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }


    getHistoricalData(opts) {
        return this.history.getHistoricalData(opts);
    }

    getReadings() {
        if (!(this.id)) {
            throw new Error('Provid a device id');
        }
        return this.ajax.get(`/devices/${this.id}/readings`);
    }

    deleteDevice(raw) {
        if (!(this.id)) {
            throw new Error('Provide the device id during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.delete(`/devices/${this.id}`)
                .then((response) => {
                    //right now the object hangs around, but on the cloud it is gone
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    sendCommand(command, raw) {
        if (!(this.id)) {
            throw new Error('Provide the device id during instantiation');
        } else if (!(command)) {
            throw new Error('Provide a command');
        }
        //path, name, value
        else if (!(command.path) && !(command.name) && !(command.value)) {
            throw new Error('Provide a properly formatted command');
        }

        return new Promise((resolve, reject) => {
            this.ajax.patch(`/devices/${this.id}`, patch, {
                raw: raw
            })
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    getChannel(transport) {
        return new Promise((resolve, reject) => {
            if (this._channelCredentials) {
                resolve(this._channelCredentials);
            } else {

                let body = {
                    deviceId: this.id,
                    transport: transport || 'mqtt'
                };
                this.ajax.post(`channels`, body)
                    .then((response) => {
                        this._channelCredentials = response;
                        if (!sharedChannel) {
                            sharedChannel = this._channelCredentials;
                        }
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

        var subscribeMqtt = (newChannelCredentials) => {
            let options = {
                password: sharedChannel.credentials.password,
                userName: sharedChannel.credentials.user
            };

            mqtt.subscribe(newChannelCredentials.credentials.topic, connection.event);
            return mqtt.connect(options);
        };

        return new Promise((resolve, reject) => {
            getChannel.then(subscribeMqtt).then(function() {
                resolve(connection);
            });
        });
    }

    getDeviceState() {
        if (!(this.id)) {
            throw new Error('Provide the device id during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.get(`/devices/${this.id}/state`)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    getDeviceConfigurations() {
        // api/devices/deviceId/configurations
        if (!(this.id)) {
            throw new Error('Provide the device id during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.get(`/devices/${this.id}/configurations`)
                .then((response) => {
                    this.configurations = response;
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    setDeviceConfigurations(schema) {
        // api/devices/deviceId/configurations
        //POST
        if (!(this.id)) {
            throw new Error('Provide the userId during instantiation');
        } else if (!(schema)) {
            throw new Error('Provide a schema of parameters to set');
        } else if (!(Object.keys(schema).length)) {
            throw new Error('Provide a schema with some parameters to set');
        }
        if (!(schema.path && schema.name && schema.value)) {
            throw new Error('Provide a schema with path, name, and value');
        }

        return new Promise((resolve, reject) => {
            this.ajax.post(`/devices/${this.id}/configurations`, schema)
                .then((response) => {
                    this.configurations.push(response);
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    getDeviceCommands() {
        // api/devices/deviceId/commands
        if (!(this.id)) {
            throw new Error('Provide the deviceId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.get(`/devices/${this.id}/commands`)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    setDeviceCommands(schema) {
        // api/devices/deviceId/commands
        //POST
        if (!(this.id)) {
            throw new Error('Provide the userId during instantiation');
        } else if (!(schema)) {
            throw new Error('Provide a schema of parameters to set');
        } else if (!(Object.keys(schema).length)) {
            throw new Error('Provide a schema with some parameters to set');
        }
        if (!(schema.path && schema.name && schema.value)) {
            throw new Error('Provide a schema with path, name, and value');
        }

        return new Promise((resolve, reject) => {
            this.ajax.post(`/devices/${this.id}/commands`, schema)
                .then((response) => {
                    this.commands.push(response);
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    getDeviceMetadata() {
        // api/devices/deviceId/metadata
        if (!(this.id)) {
            throw new Error('Provide the deviceId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.get(`/devices/${this.id}/metadata`)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    setDeviceMetadata(schema) {
        // api/devices/deviceId/metadata
        //POST
        if (!(this.id)) {
            throw new Error('Provide the userId during instantiation');
        } else if (!(schema)) {
            throw new Error('Provide a schema of parameters to set');
        } else if (!(Object.keys(schema).length)) {
            throw new Error('Provide a schema with some parameters to set');
        }

        return new Promise((resolve, reject) => {
            this.ajax.post(`/devices/${this.id}/metadata`, schema)
                .then((response) => {
                    this.metadata = response;
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    deleteDeviceMetadata() {
        // api/devices/deviceId/metadata
        //DELETE
        if (!(this.id)) {
            throw new Error('Provide the userId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.delete(`/devices/${this.id}/metadata`)
                .then((response) => {
                    //right now the object hangs around, but on the cloud it is gone
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }
};