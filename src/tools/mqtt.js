import Paho from '../vendors/mqttws31.min.js';

class Mqtt {
    constructor(config) {
        var self = this;

        this.config = {
            endpoint: "mqtt.relayr.io",
            port: 443,
            mqttTimeout: 10000
        }

        if (config) {
            Object.assign(this.config, config);
        }
        this.endpoint = this.config.endpoint;
        this.port = this.config.port
        this.clientId = 'JSDK_' + Math.floor((Math.random() * 1000))
        this._topics = {};

        try {
            this.paho = new Paho;
            this._initClient();
        } catch (e) {
            //Caught when window is not present
        }

        return this;

    }

    connect(config) {
        if (!config) throw Error("You must provide configuration options")
        if (!config.userName) throw Error("You must provide userName in options")
        if (!config.password) throw Error("You must provide password in options")
        return new Promise((resolve, reject) => {

            let options = {
                timeout: 30,
                keepAliveInterval: 10,
                cleanSession: true,
                useSSL: true,
                onSuccess: () => {
                    this.isConnecting = false;
                    this._onConnectSuccess();
                    resolve();
                },
                onFailure: (err) => {
                    this.isConnecting = false;
                    this._onConnectFailure(err);
                    reject();
                }
            };
            Object.assign(options, config);
            if (this.client) {
                this.client.onConnectionLost = () => {
                    this._onConnectionLost();
                };
                this.client.onMessageArrived = (data) => {
                    this._onMessageArrived(data);
                };

                if (!this.isConnecting) {
                    this.client.connect(options);
                    this.isConnecting = true;
                }
            }
            resolve();
        });
    }


    subscribe(topic, eventCallback) {
        if (!topic) throw Error("You must provide a topic")
        if (!eventCallback) throw Error("You must provide a callback for live events")
        if (this.client && this.client.isConnected()) this.client.subscribe(topic, 0);

        if (this._topics[topic]) {
            this._topics[topic].subscribers.push(eventCallback);
        } else {
            this._topics[topic] = {};
            this._topics[topic].subscribers = [];
            this._topics[topic].subscribers.push(eventCallback);
        }
        return this
    }

    _onConnectSuccess() {
        for (let topic in this._topics) {
            this.client.subscribe(topic, 0);
        }
    }

    _onConnectFailure(err) {
        console.log("onFailure", err)
    }

    _onConnectionLost() {
        console.log('Lost connection');
    }

    _onMessageArrived(data) {
        let dataTopic = data._getDestinationName();
        let incomingData = (data._getPayloadString());
        incomingData = JSON.parse(data._getPayloadString());

        let subscribers = this._topics[dataTopic] ? this._topics[dataTopic].subscribers : null;
        if (subscribers) {
            for (var i = subscribers.length - 1; i >= 0; i--) {
                let subscriber = subscribers[i];
                if (subscriber) {
                    subscriber(incomingData);
                }
            }

        }
    }

    _initClient() {
        this.client = new this.paho.MQTT.Client(this.endpoint, this.port, this.clientId);
        return this;
    }

}

export
let mqtt = new Mqtt();

export default Mqtt;
