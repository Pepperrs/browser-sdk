<<<<<<< HEAD
import expect, {
    createSpy, spyOn, isSpy
}
from 'expect'
import Relayr from '../src/main';

describe('Main', () => {
        describe('can be instantiated', () => {
                it('should be a constructor', () => {
                    expect(new Relayr).toBeA(Relayr);
                });
                //check that relayr should be instantiated with tools, ID, etc (??)


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
                            var relayr = RELAYR.init({
                                appId: '37648273648628',
                                redirectUri: '34324234'
                            });
                            expect(typeof relayr.login).toBe('function');

                        });
                    });
                });
=======
>>>>>>> a9673ea23bb83d3461451b46c449d7792262ca23
