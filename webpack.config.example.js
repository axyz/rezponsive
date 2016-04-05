var config = require('./webpack.config');

config.entry = [
  './example/index.js'
];

config.output = {
  publicPath: '/',
  filename: 'index.js'
};

config.resolve = {
  alias: {
    'rezponsive': '../index'
  },
  modulesDirectories: ['node_modules']
};

config.devServer = {
  contentBase: 'example/',
  stats: {colors: true}
};

module.exports = config;
