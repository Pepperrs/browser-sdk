//it is important that this constant is exactly this because relayr_access_token is how the token is labled in the local storage of the browser
const TOKEN_KEY = 'relayr_access_token';

//is this an example of the singleton you were talking about? how can you tell??
class Oauth2 {
    constructor(options) {
        this.uri = options.uri || 'api.relayr.io';
        this.appId = options.appId;
        this.redirectURI = options.redirectURI;
        this.shouldPersist = options.persist || false;
        this.protocol = options.protocol || 'https://';
    }

    login(optUser, ctx) {
        //an appID is required because by logging in you are granting an app access to your data. 
        if (!this.redirectURI) {
            throw Error('OAuth2 a valid redirect uri must be provided on login');
        } else if (!this.appId) {
            throw Error('OAuth2 a valid app ID must be provided on login');
        }

        //logging in causes a token to be stored in localstorage in the browser, so you can get it out using this
        let storedToken = localStorage.getItem(TOKEN_KEY);

        //there is also the option to cache it here in the oauth2 instance
        if (this.shouldPersist && storedToken) {
            this.token = storedToken;
            return;
        }

        //logging in returns a token, but in the address bar. this calls the parseToken method to get it out and into localStorage
        try {
            if (this._parseToken(window.location.href)) return;
        } catch (e) {}

        //I think these are the parameters to build the url to request the token??
        let authURL = {
            client_id: this.appId,
            redirect_uri: this.redirectURI,
            scope: 'access-own-user-info+configure-devices'
        };

        //I think this is the url it jumps to in order to authenticate you, the one with username and password??
        let uri = `${this.protocol}${this.uri}/oauth2/auth?client_id=${this.appId}&redirect_uri=${this.redirectURI}&response_type=token&scope=access-own-user-info+configure-devices`;

        this._loginRedirect(uri);
    }

    //this is the process by which is executes the redirect
    _loginRedirect(uri) {
        window.location.assign(uri);
    }

    //this internal method does the work of slicing the token out of the address bar and finding the part which is actually the token
    _parseToken(tokenURL) {
        //the sections of the url are always divided by a #
        //http://SOME_URL#access_token=SOME_TOKEN&token_type=Bearer
        var parts = tokenURL.split('#');

        //if either part of the url is missing, something is wrong
        if (parts[0] && parts[0].length === 0 || parts[1] && parts[1].length === 0) {
            throw Error('The provided URL is not correctly formatted');
        }

        //once we can isolate the part of the url which contains the token, we can seperate it from the type by knowing that they will be seperated by an &
        //access_token=SOME_TOKEN_HERE&token_type=Bearer
        var queryParams = parts[1].split('&');

        //the lable for the token and the token itself will be seperated by an =, same with the token type
        //access_token=SOME_TOKEN_HERE
        var authParams = queryParams.reduce(function(accumulator, pair) {
            var tuple = pair.split('=');
            accumulator[tuple[0]] = tuple[1];
            return accumulator;
        }, {});


        if (!authParams.token_type) {
            throw Error('The provided URL does not contain a access token');
        }

        //type, space, token, is the form the token takes in localStorage
        this.token = authParams.token_type + ' ' + authParams.access_token;

        this.setToken(this.token);
        return this.token;

    }

    setToken(token) {
        localStorage.setItem(TOKEN_KEY, this.token);
    }

    //removing the token from localStorage causes you to have to login and reauthorize
    logout() {
        localStorage.removeItem(TOKEN_KEY);
    }

}

export
default Oauth2;