import Oauth2 from '../authorization/oauth2.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
var expect = chai.expect;
chai.use(sinonChai);

let oauthInstance;

describe('oauth2', function() {
    beforeEach(function() {
        let options = {
            appId: 'fakeAppId',
            redirectURI: 'fakeURI'
        };
        oauthInstance = new Oauth2(options);
    });

    describe('#login', function () {
        beforeEach(function() {
            sinon.spy(oauthInstance, '_loginRedirect');
        });
        it('should bulid a URL with provided app id and redirect uri', function () {
            oauthInstance.login();

            expect(oauthInstance._loginRedirect).to.have.been.calledWith('https://api.relayr.io/oauth2/auth?client_id=fakeAppId&redirect_uri=fakeURI&response_type=token&scope=access-own-user-info+configure-devices');
        });

        it('should build a URL with configured input ', function () {
            oauthInstance.appId = 'new-fake-app-id';
            oauthInstance.login();

            expect(oauthInstance._loginRedirect).to.have.been.calledWith('https://api.relayr.io/oauth2/auth?client_id=new-fake-app-id&redirect_uri=fakeURI&response_type=token&scope=access-own-user-info+configure-devices');
        });

        it('should throw an error if no redirect uri was provided', function () {
            oauthInstance.redirectURI = null;
            var fn = function() { oauthInstance.login(); };
            expect(fn).to.throw(Error);
        });

        it('should throw an error if no app id was provided', function () {
            oauthInstance.appId = null;
            var fn = function() { oauthInstance.login(); };
            expect(fn).to.throw(Error);
        });

        it('should have a response type token', function () {
            oauthInstance.appId = null;
            var fn = function() { oauthInstance.login(); };
            expect(fn).to.throw(Error);
        });

        describe('and it should persist credentials', function() {
            beforeEach(function() {
                let options = {
                    appId: 'fakeAppId',
                    redirectURI: 'fakeURI',
                    persist: true
                };
                oauthInstance = new Oauth2(options);

                sinon.spy(oauthInstance, '_loginRedirect');
            });

            it('should not redirect if access token is present', function() {
                localStorage.setItem('relayr_access_token', 'FAKE_ACCESS_TOKEN');

                oauthInstance.login();

                expect(oauthInstance._loginRedirect).not.to.have.been.called;
            });

            it('should fetch token from localStorage', function() {
                localStorage.setItem('relayr_access_token', 'FAKE_ACCESS_TOKEN');

                oauthInstance.login();

                expect(oauthInstance.token).to.equal('FAKE_ACCESS_TOKEN');
            });

            it('should redirect if access token is not present', function() {
                localStorage.removeItem('relayr_access_token');

                oauthInstance.login();

                expect(oauthInstance._loginRedirect).to.have.been.called;
            });
        });
    });

    describe('#parseToken', function() {
        it('should return token provided in URL as a query paramter', function() {
            oauthInstance.parseToken('example.com/oauth#access_token=A_FAKE_TOKEN&token_type=Bearer');
            expect(oauthInstance.token).to.equal('Bearer A_FAKE_TOKEN');
        });

        it('should throw an error when the URL is emptys', function() {
            var fn = function() { oauthInstance.parseToken(''); };
            expect(fn).to.throw(Error);
        });

        it('should throw an error when no query parameter is provided', function() {
            var fn = function() { oauthInstance.parseToken('example.com/oauth#'); };
            expect(fn).to.throw(Error);
        });

        it('should throw an error when no access token is provided', function() {
            var fn = function() { oauthInstance.parseToken('example.com/oauth#BLABLA'); };
            expect(fn).to.throw(Error);
        });

        describe('and it should persist credentials', function() {
            it('should persist the access token in local storage as well', function() {

            });
        });
    });
});
