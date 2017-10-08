module.exports = {
  entry: './tmp/lib/text_marker.js',
  output: {
    library: 'textMarker',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: __dirname,
    filename: './dist/text_marker.js',
  }
};
