module.exports = {
  entry: './shopping-cart-react/src/app.js',

  output: {
    filename: './shopping-cart-react/app.js'
  },

  module: {
    loaders: [
      { test: /\.js$/,    loader: "jsx-loader" },
      { test: /\.js$/, loader: 'jstransform-loader' },
    ]
  }
}
