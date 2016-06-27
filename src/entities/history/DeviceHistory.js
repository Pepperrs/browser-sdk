import Ajax from '../../tools/ajax.js';
import sampleCalculator from './sampleCalculator';
import DeviceHistoryPoints from './DeviceHistoryPoints';

export
default class DeviceHistory {
    constructor(rawDevice = {}, config) {
        this.id = rawDevice.id;
        this.dataUri = config.ajax.dataUri;
        this.ajax = new Ajax({
            uri: config.ajax.dataUri,
            token: config.ajax.token
        });
    }

    //KM why would you hardcode in an empty obj? where do you get the option to give it start, end, whatever?
    getHistoricalData(opts = {}) {
        let {
            limit = 1000, offset = 0, end, start, sample, periode
        } = opts;
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
            //KM I thought history didn't hit the same api.relayr.io thing?
            this.ajax.get(`/history/devices/${this.id}`, {
                queryObj: queryParams
            }).then(function(response) {
                resolve({
                    points: new DeviceHistoryPoints(response.results),
                    response: response
                });
            }, reject);
        });
    }
};