module.exports = function(config) {
    config.set({
        singleRun: true,
        frameworks: ['mocha'],

        files: [
            './test/oauth2.test.js'
        ],

        preprocessors: {
            './test/oauth2.test.js': ['webpack']
        },

        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader'
                    }
                ]
            },
            output: {
                publicPath: '/'
            },
            resolve: {
                extensions: ['', '.js']
            }
        },

        browsers: ['PhantomJS']
    });
};
