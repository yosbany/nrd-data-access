const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'nrd-data-access.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'NRDDataAccess',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
  },
  // Firebase will be bundled with the library
};

