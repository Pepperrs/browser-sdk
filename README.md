The relayr JavaScript SDK
=========================

Welcome to the relayr JavaScript SDK. This easy to use JavaScript implementation will allow you to quickly create relayr browser side web applications, start receiving data from your sensors and display the data received in your browser.


## Implementing the SDK

In order to start using the SDK all you would need to do is to include the `relayr-browser-sdk.min.js` file in your project:

	<script src="https://developer.relayr.io/relayr-browser-sdk.min.js"></script>

## Using the SDK

For a list of the basic available functionalities in the SDK please refer to our [Web Development Documentation](https://developer.relayr.io/documents/WebDev/WebDevelopers)


### Usage

```
npm install

```

Maybe you need to add .babelrc per hand if it is not copied properly.

### Build

For the build process you need to install the webpack cli:

```
npm install webpack -g
```

```
npm run build:js
npm run build:min:js
```

### Tests

```
npm test
npm run test:watch
```
[assertion library](https://github.com/mjackson/expect)

### Run the webpack dev server and run some examples

```
npm start
open http://localhost:3000/examples/index.html
```