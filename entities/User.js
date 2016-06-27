import Ajax from '../tools/ajax.js'

//The User class contains the methods which pertain to the specific user, or more broadly, 
//only require the userId as a parameter in the call.
export
default class User {
    constructor(config) {
        this.config = config;
        this.ajax = new Ajax(config.ajax);
    }

    //resolves the promise with an object containing name, id, and email, or the error
    //this must be called before any of the methods requiring userId
    getUserInfo() {
        return new Promise((resolve, reject) => {
            //if there already is userInfo cached, pass it through
            if (this.userInfo) {
                resolve(this.userInfo);
            } else {
                //if not, hit the API and ask for it, which requires only the oauth token
                this.ajax.get("/oauth2/user-info").then((response) => {
                    //then assign it to the instance of the class and pass it through
                    this.userInfo = response;
                    resolve(response)
                }).catch((error) => {
                    reject(error);
                });

            }
        });
    }

    // resolves with an array of objects, each of which is a device and has the parameters id, name, secret, owner, public, and integrationType
    getMyDevices() {
        return new Promise((resolve, reject) => {
            this.getUserInfo().then(() => {
                this.ajax.get(`/users/${this.userInfo.id}/devices`).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error);
                });
            });
        })
    }

    //resolves with an array containing an object for each group, which contains id, name, owner, an array of devices in the group, and position
    getMyGroups() {
        return new Promise((resolve, reject) => {
            this.getUserInfo().then(() => {
                this.ajax.get(`/users/${this.userInfo.id}/groups`).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error);
                });
            });
        })
    }

    //resolves with an array containing an object for each transmitter, which contains id, secret, owner, name, credentials, and integrationType 
    getMyTransmitters() {
        return new Promise((resolve, reject) => {
            this.getUserInfo().then(() => {
                this.ajax.get(`/users/${this.userInfo.id}/transmitters`).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error);
                });
            });
        })
    }

    //this internal method does??
    _getConfig() {
        return this.config;
    }
}