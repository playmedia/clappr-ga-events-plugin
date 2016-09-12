var path = require('path');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');

var plugins = [
  new Clean(['dist'])
];

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  plugins: plugins,
  externals: {
    clappr: 'Clappr',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
            compact: true,
        }
      },
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'clappr-ga-events-plugin.js',
    library: 'ClapprGaEventsPlugin',
    libraryTarget: 'umd',
  },
};
