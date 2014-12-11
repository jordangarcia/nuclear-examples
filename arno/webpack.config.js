module.exports = {
  entry: './arno/index.js',

  output: {
    filename: './arno/app.js'
  },

  module: {
    loaders: [
      { test: /\.js$/,    loader: "jsx-loader" },
      { test: /\.js$/, loader: 'jstransform-loader' },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.css$/, loaders: ["style", "css"] },
      { test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded" },
    ]
  }
}
