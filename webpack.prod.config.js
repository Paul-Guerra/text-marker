const merge = require('webpack-merge');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.config');
const version = require('./package.json').version;

const prod = {
  devtool: 'cheap-module-source-map',
  output: {
    filename: './dist/text_marker.js',    
    auxiliaryComment: { root: `Text Marker Library version ${version}` },
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

module.exports = merge(common, prod);
