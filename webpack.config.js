module.exports = {
  devtool: 'source-map',
  entry: './dist/index.js',
  output: {
    path: __dirname,
    filename: './dist/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[path][name]---[local]---[hash:base64:5]'
      }
    ]
  }
};
