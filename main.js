class Relayr {

    constructor(project) {
        this.project = project;

        this.auth = new(require('./authorization/oauth2.js')(project));

        this.tools = {
            mqtt: require('./tools/mqtt.js'),
            restClient: require("/tools/rest.js")
        }

        this.entities = {
            User: require('./entities/User.js'),
            Device: require('./entities/Device.js'),
            Group: require('./entities/Group.js'),
            Model: require('./entities/Model.js')
        }
    }

    authorize(optUser) {
        //optUser: can be a static user we can inject ie. {user:id, token:token}

        return new Promise((resolve, reject) => {

            this.auth.login(optUser).then((token) => {

                var user = new this.entities.User(token, user);
                this._currentUser = user;
                resolve(user);

            }).catch(reject);
        });
    }

    get user() {
        return this._currentUser;
    }

}


//Usage:

() => {

    const relayr = new Relayr({
        "projectId": "{AppId/ProjectId}",
        "redirectUri": "{RedirectUri for token parsing}"
    });


    relayr.authorize().then((user) => {
        user.update({
            "email": "newEmalil@relayr.io"
        })
    });
    // Returns a promise with a user class

    relayr.user; // {userId:"123", email: "email@relayr.io"}

    relayr.user.updateUser({});

    relayr.user.newDevice({
        "name": "Temperature"
    }) // Returns new Device class && does the POST api call

    relayr.user.getDevices().then((devices, ISRAW) => { //Array of device Classes
        devices[0] // returns a Device Class
        devices[0].deviceId // deviceId:"123"
        devices[0].meanings // array of meanings
        devices[0].update({
            "name": "New Temperature"
        });
        devices[0].delete();
        devices[0].getRawData()

        relayr.devices.deleteDevice({})

        devices[0].connect({
            transport: ""
        }).then((connection) => { //establishes WebSocket/Mqtt connection to
            connection.on("data", (readings) => { //Event / Callback driven piping from the MQTT tool
                readings // Array of readings from the Device
            });
        });
    });

})();