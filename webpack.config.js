const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ENVIRONMENT = process.env.NODE_ENV || 'production';
const pkg = require('./package.json');

const conf = {
  devtool: 'source-maps',
  entry: './index',
  externals: [
  ],
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
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
};

if (ENVIRONMENT === 'production') {
  conf.externals.push('react');
  Object.keys(pkg.dependencies).forEach((dep) => {
    conf.externals.push(dep);
  });
}

module.exports = conf;
