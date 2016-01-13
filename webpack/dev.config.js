var host = 'localhost';
var port = process.env.WEBPACK_PORT || 3001;
var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, '../node_modules');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var fs = require('fs');
var _ = require('lodash');
var relativeAssetsPath = '../static/dist';
var StatsPlugin = require('stats-webpack-plugin');
var rimraf = require('rimraf');
var jsonfile = require('jsonfile');

var versionFile = './version.json';
var versionObject = {version: ''};

jsonfile.writeFileSync(versionFile, versionObject);

rimraf.sync(path.resolve(__dirname, relativeAssetsPath));

var config = {
    devtool: 'eval-source-map',
    entry: {
        main: [
            'webpack-dev-server/client?http://' + host + ':' + port,
            'webpack/hot/only-dev-server',
            path.resolve(__dirname, '../src/client.js')
        ],
        vendors: ['react', 'moment', 'lodash', 'qs', 'redux', 'react-router', 'react-redux', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, '../static/dist'),
        filename: '[name].js',
        publicPath: 'http://' + host + ':' + port + '/dist/'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules|bootstrap|contrib/,
                loaders: ['eslint-loader']
            }
        ],
        loaders: [
            { test: /\.(jpe?g|png|gif|svg|ttf|woff|woff2|eot|htc)$/, loader: 'url', query: {limit: 10240} },
            { test: /\.js$/, exclude: /node_modules|contrib/, loaders: ['react-hot', 'babel?stage=0&optional=runtime&plugins=typecheck']},
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.scss$/, exclude: /node_modues/, loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true' },
            { test: /\.(htc)$/, loader: 'url', query: {limit: 10240}}
        ]
    },
    resolve: {
        alias: {
            react: path.join(path.resolve(__dirname, '..'), 'node_modules', 'react')
        },
        modulesDirectories: [
            'src',
            'node_modules'
        ],
        extensions: ['', '.json', '.js']
    },
    eslint: {
        emitWarning: true
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', Infinity),

        // css files from the extract-text-plugin loader
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: true,
            __DEVTOOLS__: true
        }),

        // ignore dev config
        new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
        new StatsPlugin('stats.json', {
            chunkModules: false,
            exclude: [/node_modules[\\\/]react/],
            hash: false,
            version: false,
            timings: false,
            assets: true,
            chunks: false,
            modules: false,
            cached: false,
            reasons: false,
            source: false,
            errorDetails: false,
            chunkOrigins: false,
            modulesSort: false,
            chunksSort: false,
            assetsSort: false
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;