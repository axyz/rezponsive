const path = require('path');
const ENVIRONMENT = process.env.NODE_ENV || 'production';

const conf = {
  devtool: 'source-maps',
  entry: './index',
  externals: {
  },
  resolve: {
    modules: ['node_modules']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  output: {
    filename: 'rezponsive.js',
    library: 'rezponsive',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: []
};

if (ENVIRONMENT === 'production') {
  conf.externals.react = 'react';
  conf.externals['react-dom'] = 'react-dom';
}

module.exports = conf;
