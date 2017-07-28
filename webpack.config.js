module.exports = {
  devtool: 'source-map',
  entry: './dist/index.js',
  output: {
    path: __dirname,
    filename: './dist/bundle.js'
  }
};
