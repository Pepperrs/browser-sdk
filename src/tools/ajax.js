export
default class Ajax {
    constructor(options) {
        this.tokenType = 'Bearer';
        this.token = options.token;
        this.uri = options.uri || 'api.relayr.io/';
        this.protocol = options.protocol || 'https://';
        this.customXHR;
    }

    get(url, opts = {
        contentType: 'application/json'
    }) {

        if (!url) {
            throw new Error('Please provide atleast a url');
        }
        if (typeof(url) !== 'string') {
            throw new Error('Please provide a string url');
        }
        url += this._serializeQueryStr(opts.queryObj);

        return new Promise((resolve, reject) => {
            var xhrObject = this._xhrRequest({
                type: 'GET',
                url: url,
                isObject: opts.raw || true,
                contentType: opts.contentType
            }).then((result) => {
                resolve(result);
            }).catch((xhrObject) => {
                reject(xhrObject);
            });
        });
    }


    post(url, body, opts = {
        contentType: 'application/json'
    }) {
        if (!url) throw new Error('Please provide atleast a url');
        if (typeof(url) !== 'string') throw new Error('Please provide a string url');

        return new Promise((resolve, reject) => {
            var xhrObject = this._xhrRequest({
                type: 'POST',
                url: url,
                body: body,
                isObject: opts.raw || true,
                contentType: opts.contentType
            }).then((result) => {
                resolve(result);
            }).catch((xhrObject) => {
                reject(xhrObject);
            });
        });
    }

    patch(url, body, opts = {
        contentType: 'application/json'
    }) {
        if (!url) throw new Error('Please provide atleast a url');
        if (typeof(url) !== 'string') throw new Error('Please provide a string url');

        return new Promise((resolve, reject) => {
            var xhrObject = this._xhrRequest({
                type: 'PATCH',
                url: url,
                body: body,
                isObject: opts.raw || true,
                contentType: opts.contentType
            }).then((result) => {
                resolve(result);

            }).catch((xhrObject) => {
                reject(xhrObject);
            });
        });
    }

    delete(url, opts = {
        contentType: 'application/json'
    }) {
        if (!url) throw new Error('Please provide atleast a url');
        if (typeof(url) !== 'string') throw new Error('Please provide a string url');

        return new Promise((resolve, reject) => {
            var xhrObject = this._xhrRequest({
                type: 'DELETE',
                url: url,
                isObject: opts.raw || true,
                contentType: opts.contentType
            }).then((result) => {
                resolve(result);

            }).catch((xhrObject) => {
                reject(xhrObject);
            });
        });
    }


    _serializeQueryStr(obj) {
        var str = [];

        if (!obj || Object.keys(obj).length === 0) {
            return '';
        }

        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return '?' + str.join('&');
    }


    _xhrRequest(options) {

        let xhrObject;

        xhrObject = new XMLHttpRequest();

        xhrObject.open(
            options.type,
            `${this.protocol}${this.uri}${options.url}`,
            true
        );

        xhrObject.setRequestHeader('Authorization', this.token);
        xhrObject.setRequestHeader('Content-Type', options.contentType);


        return new Promise((resolve, reject) => {

            xhrObject.onreadystatechange = function() {
                if (xhrObject.readyState === 4) {
                    if (xhrObject.status > 199 && xhrObject.status < 299) {
                        //2xx success
                        if (options.isObject) {

                            resolve(JSON.parse(xhrObject.responseText));
                        } else {

                            resolve(xhrObject.responseText);
                        }
                    } else if (xhrObject.status > 399 && xhrObject.status < 499) {
                        //4xx client error
                        console.log('there seems to be a problem on the client side');
                        reject(xhrObject);
                    } else if (xhrObject.status > 499) {
                        //5xx server error
                        console.log('there seems to be a problem on the server side');
                        reject(xhrObject);
                    }
                }
            };

            if (options.body) {
                xhrObject.send(JSON.stringify(options.body));
            } else {
                xhrObject.send();
            }
        });
    }
}