export
default class DeviceHistoryPoints {
    //KM what are the poijnts for? is it like an array of the history readings or something?
    constructor(deviceHistory) {
        if (!deviceHistory) {
            return {};
        }

        let devicesPoints = {};

        deviceHistory.forEach((res) => {
            var key = this._getKey(res.meaning, res.path);
            if (devicesPoints[key]) {
                devicesPoints[key].points = devicesPoints[key].points.concat(res.points);
            } else {
                devicesPoints[key] = Object.assign({
                    id: res.deviceId
                }, res);
                delete devicesPoints[key].deviceId;
            }
        });

        this.devicesPoints = devicesPoints;
    }

    _getKey(meaning, path) {
        if (!path || path === 'null') {
            return meaning;
        }

        if (!meaning || meaning === 'null') {
            return path;
        }
        return `${meaning}-${path}`;
    }

    get(meaning, path) {
        return this.devicesPoints[this._getKey(meaning, path)];
    }
}