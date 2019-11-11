const path = require('path')

const testMatch = process.env.TEST_MATCH ? process.env.TEST_MATCH : 'tests/**/*.test.js'

module.exports = {
  testMatch: [path.resolve(__dirname, testMatch)], // 'tests/**/*.mount.js'
  webpackConfig: '.storybook/webpack.config.js',
  setupTestFrameworkScriptFile: 'tinkoff-form-builder/puppeteer/utils/expects',
  setupMockGlobalFunc: './tests/codeceptjs/mockGlobalFunc.js',
  outputStatic: './public/test-storybook/',
  maxWorkers: 4,
}
