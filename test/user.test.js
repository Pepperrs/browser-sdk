
<<<<<<< HEAD

describe('user', () => {

        let fakeuser;
        beforeEach(() => {

            //from old tests to fake requests
            describe('relayr SDK', function() {
                var xhr, requests;
                beforeEach(function() {
                    xhr = sinon.useFakeXMLHttpRequest();
                    requests = [];
                    xhr.onCreate = function(xhr) {
                        requests.push(xhr);
                    }
                });

                describe('#init', function() {
                    var validInputs = [{
                        appId: "37648273648628",
                        redirectUri: "34324234"
                    }];

                    //presumably the form of this will change?
                    it('should initialize with constructor with valid arguments', function() {
                        var relayr = new RELAYR({
                            appId: '37648273648628',
                            redirectUri: '34324234'
                        });
                        expect(typeof relayr.login).toBe('function');

                    });
                });
            });
            //will this stay the same as last time? Almost definitely not...
            // describe('users', () => {
            //     var relayr;
            //     beforeEach(function() {
            //         relayr = relayrInit();
            //         relayr.account = {
            //             id: 'test-dummy-account-id',
            //             token: 'test-dummy-token'
            //         };
            //     });

            //stub a user object returned from the cloud- this should have all the parameters of a legit user
            //this json will be a fixture, created with a factory

            var fakeUser = {
                "id": "fakeUserId",
                "name": "fakeUserName"
                "email": "fakeName@fakeemail.com",
                // "token": "fakeToken",
                // "devices": [{}, {}, {}]
            }
            before(function() {
                sinon.stub().yieldsTo("success", fakeUser);
            });
        })

        describe('can be instantiated', () => {
            it('should be a constructor', () => {
                expect(new User).toBeA(User);
            });
        });

        describe('#getuser', function() {
            let userInstance;
            let fakeToken = 'sdfhsjhzhbfzhb'
            beforeEach(() => {
                userInstance = new User(fakeToken);
            })

            //THIS ONE is a correct example, everything else is junk
            it('should throw an error if no id is provided', function() {
                expect(userInstance.getuser()).toThrow();
            });

            it('should do a GET to get the user object', function() {
                expect(userInstance.getuser({
                    fakeToken
                }, function() {}, function() {})). //toReturn? or something?


                expect(requests.length).toBe(1);
                var req = requests[0];
                expect(req.url).toBe('https://api.relayr.io/users/user-id');
            });

            it('should resolve promise when it gets user', function(done) {
                user.getuser({
                    userId: 'user-id'
                }).then(function() {
                    expect(true).toBeTruthy();
                    done();
                }, function() {});

                var req = requests[0];
                req.respond(200, {}, JSON.stringify([]));
            });


            it('should reject promise if the request fails', function(done) {
                user.getuser({
                    userId: 'user-id'
                }).then(function() {}, function() {
                    expect(true).toBeTruthy();
                    done();
                });

                var req = requests[0];
                req.respond(401, {
                    "Content-Type": "application/json"
                }, JSON.stringify({
                    error: "error"
                }));
            });
        });
=======
>>>>>>> a9673ea23bb83d3461451b46c449d7792262ca23
