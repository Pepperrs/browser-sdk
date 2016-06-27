import Ajax from '../../tools/ajax.js';
import sampleCalculator from './sampleCalculator';
import DeviceHistoryPoints from './DeviceHistoryPoints';

export default class DeviceHistory {
    constructor(rawDevice = {}, config) {
        this.id = rawDevice.id;
        this.dataUri = config.ajax.dataUri;
        this.ajax = new Ajax({
            uri: config.ajax.dataUri,
            token: config.ajax.token
        });
    }

    getHistoricalData(opts = {}) {
        let { limit = 1000, offset = 0, end, start, sample, periode } = opts;
        let queryParams = {};

        if (periode && periode.length > 0) {
            let sampleObj = sampleCalculator(periode);
            sample = sampleObj.sampleSize;
            start = sampleObj.start;
            end = sampleObj.end;
        }

        if (sample !== undefined) {
            queryParams.sample = sample;
        }

        if (end) {
            queryParams.end = end.getTime();
        }
        if (start) {
            queryParams.start = start.getTime();
        }

        queryParams.offset = offset;
        queryParams.limit = limit;

        return new Promise((resolve, reject) => {
            this.ajax.get(`/history/devices/${this.id}`, { queryObj: queryParams }).then(function(response) {
                resolve({
                    points: new DeviceHistoryPoints(response.results),
                    response: response
                });
            }, reject);
        });
    }
};
