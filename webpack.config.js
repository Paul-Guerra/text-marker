const merge = require('webpack-merge');
const common = require('./webpack.common.config');

const dev = {
  devtool: 'source-map',
  output: {
    filename: './dist/text_marker.js',
    auxiliaryComment: { root: 'Text Marker Library DEVELOPMENT version' },
  }
};

module.exports = merge(common, dev);
