import Ajax from '../tools/ajax.js'

export
default class User {
  constructor(config) {
    this.config = config;
    this.ajax = new Ajax(config.ajax);
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) {
        resolve(this.userInfo);
      } else {
        this.ajax.get("/oauth2/user-info").then((response) => {
          this.userInfo = response;
          resolve(response)
        }).catch((error) => {
          reject(error);
        });

      }
    });
  }

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

  getMyGroups() {
    return new Promise((resolve, reject) => {
      this.getUserInfo().then(() => {
        this.ajax.get(`/users/${this.userInfo.id}/groups`).then((response) => {
          console.log('1');
          resolve(response)
        }).catch((error) => {
          reject(error);
        });
      });
    })
  }

  _getConfig() {
    return this.config;
  }
}