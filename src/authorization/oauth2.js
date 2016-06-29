const TOKEN_KEY = 'relayr_access_token';
class Oauth2 {
    constructor(options) {
        this.uri = options.uri || 'api.relayr.io';
        this.appId = options.appId;
        this.redirectURI = options.redirectURI;
        this.shouldPersist = options.persist || true;
        this.protocol = options.protocol || 'https://';
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
        try {
            if (this._parseToken(window.location.href)) return;
        } catch (e) {}

        let authURL = {
            client_id: this.appId,
            redirect_uri: this.redirectURI,
            scope: 'access-own-user-info+configure-devices'
        };

        let uri = `${this.protocol}${this.uri}/oauth2/auth?client_id=${this.appId}&redirect_uri=${this.redirectURI}&response_type=token&scope=access-own-user-info+configure-devices`;

        this._loginRedirect(uri);
    }

    _loginRedirect(uri) {
        window.location.assign(uri);
    }

    _parseToken(tokenURL) {
        var parts = tokenURL.split('#');

        if (parts[0] && parts[0].length === 0 || parts[1] && parts[1].length === 0) {
            throw Error('The provided URL is not correctly formatted');
        }


        var queryParams = parts[1].split('&');


        var authParams = queryParams.reduce(function(accumulator, pair) {
            var tuple = pair.split('=');
            accumulator[tuple[0]] = tuple[1];
            return accumulator;
        }, {});


        if (!authParams.tokenType) {
            throw Error('The provided URL does not contain a access token');
        }

        this.token = authParams.tokenType + ' ' + authParams.access_token;

        this.setToken(this.token);
        return this.token;

    }

    setToken(token) {
        localStorage.setItem(TOKEN_KEY, this.token);
    }


    logout() {
        localStorage.removeItem(TOKEN_KEY);
    }

}

export
default Oauth2;