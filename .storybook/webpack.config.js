const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const localConfig = {
  devtool: 'source-map',
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
         use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      EXPOSE_STORES: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BROWSER: true,
      },
    }),
  ],
}

module.exports = ({ config }) => {

  return merge(config, localConfig)
}
