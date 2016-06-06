const TOKEN_KEY = 'relayr_access_token';
class Oauth2 {

    constructor(options) {
        this.appId = options.appId;
        this.redirectURI = options.redirectURI;
        this.shouldPersist = options.persist || false;
    }

    login(optUser, ctx) {
        if (!this.redirectURI) {
            throw Error('OAuth2 a valid redirect uri must be provided on login');
        } else if (!this.appId) {
            throw Error('OAuth2 a valid app ID must be provided on login');
        }

        let storedToken = localStorage.getItem(TOKEN_KEY);
        if (this.shouldPersist && storedToken) {
            this.token = storedToken;
            return;
        }

        this._loginRedirect(`https://api.relayr.io/oauth2/auth?client_id=${this.appId}&redirect_uri=${this.redirectURI}&response_type=token&scope=access-own-user-info+configure-devices`);
    }

    _loginRedirect() {}

    parseToken(tokenURL) {
        var parts = tokenURL.split('#');
        if (parts[0].length === 0 || parts[1].length === 0) {
            throw Error('The provided URL is not correctly formatted');
        }
        var queryParams = parts[1].split('&');
        var authParams = queryParams.reduce(function(accumulator, pair) {
            var tuple = pair.split('=');
            accumulator[tuple[0]] = tuple[1];
            return accumulator;
        }, {});

        if (!authParams.token_type) {
            throw Error('The provided URL does not contain a access token');
        }

        this.token = authParams.token_type + ' ' + authParams.access_token;
    }
}

module.exports = Oauth2;