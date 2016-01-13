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
var versionObject = {version: Date.now()};

jsonfile.writeFileSync(versionFile, versionObject);

rimraf.sync(path.resolve(__dirname, relativeAssetsPath));

var config = {
    entry: {
        main: path.resolve(__dirname, '../src/client.js'),
        vendors: ['react', 'moment', 'lodash', 'qs', 'redux', 'react-router', 'react-redux', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, '../static/dist'),
        filename: '[name]' + versionObject.version + '.js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [node_modules_dir],
                loader: 'babel',
                query: {
                    optional: ['runtime'],
                    stage: 0
                }
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true')
            }, {
                test: /\.(htc)$/,
                loader: 'url',
                query: {limit: 10240}
            }]
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
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors' + versionObject.version + '.js', Infinity),

        // css files from the extract-text-plugin loader
        new ExtractTextPlugin('[name]' + versionObject.version + '.css', {allChunks: true}),
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: false,
            __DEVTOOLS__: false
        }),

        // ignore dev config
        new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

        // set global vars
        new webpack.DefinePlugin({
            'process.env': {
                // Useful to reduce the size of client-side libraries, e.g. react
                NODE_ENV: JSON.stringify('production')
            }
        }),
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

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        // optimizations
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin()
    ]
};
//
module.exports = config;
