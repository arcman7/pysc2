var path = require('path');

module.exports = {
  mode: 'development',
  entry: '../pysc2/setup.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'pysc2.bundle.js'
  },
  module: {
    loaders: [
      { exclude: ['node_modules'], loader: 'babel', test: /\.js?$/ },
      { loader: 'url-loader', test: /\.gif$/ },
      { loader: 'file-loader', test: /\.(ttf|eot|svg)$/ },
    ],
  },
  resolve: {
    alias: {
      config$: './configs/app-config.js',
      react: './vendor/react-master',
    },
    extensions: ['', 'js', 'jsx'],
    modules: [
      'node_modules',
      'bower_components',
      'shared',
      '/shared/vendor/modules',
    ],
  },
};
