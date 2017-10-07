const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const version = require('./package.json').version;

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './dist/lib/text_marker.js',
  output: {
    library: 'textMarker',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: __dirname,
    auxiliaryComment: { root: `Text Marker Library version ${version}` },
    filename: `./dist/text_marker_v${version}.js`
  },
  plugins: [
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
};
