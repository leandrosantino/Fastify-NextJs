const path = require('path');
const nopdeExternals = require('webpack-node-externals')
const tsconfigPaths = require('tsconfig-paths-webpack-plugin')
const mode = 'development'//'production'//

module.exports = {
  mode,
  entry: {
    index: {
      import: './src/index.ts',
    },
  },
  target: 'node',
  externals: [
    function ({ request }, callback) {
      if (request.includes('../../orm')) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
    nopdeExternals()
  ],
  externalsPresets: {
    node: true
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: { loader: 'ts-loader' },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new tsconfigPaths({ baseUrl: './' })
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './build/server'),
    clean: true,
  },
};
