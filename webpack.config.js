// webpack.config.js
var path = require('path')
var path = require('path')

module.exports = {
  entry: {
    innie: './src/devices/webpage/innie/innie.js',
    webapp: './src/webapp/main.js',
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[chunkhash].js"
  },
  resolve: {
    root: [
      path.join(__dirname,  './src'),
      path.join(__dirname, './node_modules'),
    ],
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/, // include .js files
        exclude: /node_modules/, // exclude any and all files in the node_modules folder
        loader: "jshint-loader"
      }
    ],

    loaders: [
      { test: /\.js$/, loader: 'jstransform-loader' },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.css$/, loaders: ["style", "css"] },
      { test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded" },
    ]
  },
  jshint: {
    asi: true,
    esnext: true,
  }
};
