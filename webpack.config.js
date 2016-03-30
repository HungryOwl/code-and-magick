'use strict';

var isDevelopmentVersion = process.argv[1].split('/').slice(-1)[0].indexOf('dev') > -1;

module.exports = {
  devServer: {
    contentBase: './build'
  },

  entry: './src/main.js',

  output: {
    filename: isDevelopmentVersion ? './js/main.js' : './build/js/main.js'
  },

  resolve: {
    modulesDirectories: ['node_modules', './src']
  }
};
