export
default class DeviceHistoryPoints {
    //deviceHistory imports this class
    constructor(deviceHistory) {
        if (!deviceHistory) {
            return {};
        }

        let devicesPoints = {};

        // what is it doing here??
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

    //returns path or meaning or both
    _getKey(meaning, path) {
        if (!path || path === 'null') {
            return meaning;
        }

        if (!meaning || meaning === 'null') {
            return path;
        }
        return `${meaning}-${path}`;
    }

    //what is the difference between this and the one above??
    get(meaning, path) {
        return this.devicesPoints[this._getKey(meaning, path)];
    }
}