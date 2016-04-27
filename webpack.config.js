'use strict';

var path = require('path');

var isDevelopmentVersion = process.argv[1].split('/').slice(-1)[0].indexOf('dev') > -1;

module.exports = {
  devServer: {
    contentBase: './build'
  },

  entry: './src/main.js',

  output: {
    filename: 'js/main.js',
    path: isDevelopmentVersion ? path.resolve(__dirname) : path.resolve(__dirname, 'build')
  },

  resolve: {
    modulesDirectories: ['node_modules', './src']
  }
};
