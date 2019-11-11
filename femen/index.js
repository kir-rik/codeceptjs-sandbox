let mocker = {}

if (!process.env.FEMEN_IS_STORYBOOK) {
  mocker = require('puppeteer-request-mocker')
}

module.exports = {
  mockJest: require('./mockJest'),
  mountInBrowser: require('./mountInBrowser'),
  mocker,
}
