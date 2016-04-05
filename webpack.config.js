const ENVIRONMENT = process.env.NODE_ENV || 'production';

const conf = {
  devtool: 'source-maps',
  entry: './index',
  externals: {
  },
  resolve: {
    alias: {},
    modulesDirectories: ['node_modules']
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.jsx?$/
      }
    ],
    preLoaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }]
  },
  output: {
    filename: 'rezponsive.js',
    library: 'rezponsive',
    libraryTarget: 'umd',
    path: './dist/'
  },
  plugins: []
};

if (ENVIRONMENT === 'production') {
  conf.externals.react = 'react';
  conf.externals['react-dom'] = 'react-dom';
}

module.exports = conf;
