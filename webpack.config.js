// Webpack 4 configuration
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');
const NotifierPlugin = require('webpack-build-notifier')

var name = 'clappr-ga-events-plugin'
var outputFile, plugins = [], optimization = {}

if (process.env.npm_lifecycle_event === 'dist') {
  outputFile = name + '.min.js'
  optimization.minimizer = [
    new TerserPlugin({
      cache: true, // TODO: set to false if Webpack upgraded to 5.x ?
    }),
  ]
} else {
  outputFile = name + '.js'
  optimization.minimize = false
}

plugins.push(new NotifierPlugin({
  title: optimization.minimizer ? 'minified ' + name : name,
}))

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFile,
    library: 'ClapprGaEventsPlugin',
    libraryTarget: 'umd',
  },
  optimization: optimization,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        include: [
          path.resolve(__dirname, 'src')
        ],
      },
    ],
  },
  plugins: plugins,
  externals: {
   clappr: {
    amd: 'clappr',
    commonjs: 'clappr',
    commonjs2: 'clappr',
    root: 'Clappr'
   }
  },
  devServer: {
    contentBase: [
      path.resolve(__dirname, "public"),
    ],
    // publicPath: '/js/',
    disableHostCheck: true, // https://github.com/webpack/webpack-dev-server/issues/882
    compress: true,
    host: "0.0.0.0",
    port: 8080
  }
}
