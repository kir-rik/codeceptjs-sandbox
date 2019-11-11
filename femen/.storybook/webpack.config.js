const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

if (!process.env.TEST_MATCH) {
  throw new Error(`process.env.TEST_MATCH must be set to build femen storybook!`)
}

let appWebpackCfg = {}

try {
  if (process.env.APP_WEBPACK_CONFIG_PATH) {
    const appWebpackConfigPath = decodeURIComponent(process.env.APP_WEBPACK_CONFIG_PATH)
    appWebpackCfg = require(appWebpackConfigPath)
  }
} catch (e) {
  console.log('Application level webpack config not found. Using the default one.')
  // pass
}

module.exports = merge(appWebpackCfg, {
  plugins: [
    new webpack.EnvironmentPlugin(['FEMEN_IS_STORYBOOK']),
    // new BundleAnalyzerPlugin(),
  ],
})
