import Oauth2 from './authorization/oauth2';
import User from './entities/User';
import Device from './entities/Device';
import Ajax from './tools/ajax';
//KM why is mqtt an object?
import {
    mqtt
}
from './tools/mqtt';

//KM why device and nothing else?
export
let device = Device;

const config = {
    persistToken: true,
    mqtt: {
        endpoint: 'mqtt.relayr.io'
    },
    ajax: {
        uri: 'api.relayr.io',
        dataUri: 'data-api.relayr.io',
        protocol: 'https://'
    }
};

let currentUser;
let project;
let oauth2;

//KM what it the init/authorize process here? How do you work with it with an "export default" rather than a class name?
export
default {
    //KM does p by definition include redirect and appID like last time? Should we make that clearer here, or somewhere?
    init: function(p, customConfig) {
        project = p;

        if (customConfig) {
            Object.assign(config, customConfig);
        }
    },

    authorize: function(optionalToken) {
        return new Promise((resolve, reject) => {

            if (!oauth2) {
                oauth2 = new Oauth2({
                    protocol: config.ajax.protocol,
                    uri: config.ajax.uri,
                    appId: project.id,
                    redirectURI: project.redirectURI,
                    persist: config.persistToken
                });
            }
            if (!optionalToken) {
                oauth2.login();

                config.ajax.token = oauth2.token;

            } else {
                config.ajax.token = optionalToken;
            }

            currentUser = new User(config);
            resolve(currentUser);
        });
    },

    logout: function() {
        oauth2.logout();
    },

    getConfig: function() {
        return config;
    },

    customAjax: function(ajaxConfiguration) {
        return new Ajax(ajaxConfiguration || config.ajax);
    }
};

// console.log(mqtt)

// const r = new Relayr();


// let options = {
//     password: "vcG1ljmeqoSr",
//     userName: "297a005c-f11e-4b2a-92d0-1d42fa4400b6:3b383d97-8287-4a95-8bc6-c4cfeb5ddc6a",
// }
// console.log(options)
// mqtt.subscribe("/v1/50a66b82-cbea-452b-9c96-bac80b3a6538", function(sensorData) {
//     console.log("sensor data", sensorData)
// });
// mqtt.connect(options)