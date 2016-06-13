import Ajax from '../tools/ajax.js';

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


  getDeviceState() {

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
      throw new Error('Provide the userId during instantiation');
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
  connect() {
    //do some mqtt nonsense
  }
};