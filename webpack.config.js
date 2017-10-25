const merge = require('webpack-merge');
const common = require('./webpack.common.config');

const dev = {
  output: {
    filename: './tmp/build/text_marker.js',    
    auxiliaryComment: { root: 'Text Marker Library DEVELOPMENT version' },
  }
};

module.exports = merge(common, dev);
