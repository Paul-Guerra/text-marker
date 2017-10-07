module.exports = {
  entry: './dist/lib/text_marker.js',
  output: {
    library: 'textMarker',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: __dirname,
    filename: './dist/text_marker.js',
  }
};
