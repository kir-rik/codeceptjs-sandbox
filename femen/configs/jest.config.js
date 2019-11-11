const path = require('path')
const femenConfigPath = process.env.FEMEN_CONFIG_PATH
let testMatch
let femenFileConfig = {}

if (!process.env.TEST_MATCH) {
  throw new Error(`process.env.TEST_MATCH must be set to run femen jest!`)
}

try {
  testMatch = JSON.parse(decodeURIComponent(process.env.TEST_MATCH))
} catch (e) {
  console.error('TEST_MATCH wasn\'t parsed! Exiting now...', e)
  process.exit()
}

try {
  femenFileConfig = require(femenConfigPath)
} catch (e) {
  // pass
}

module.exports = {
  ...femenFileConfig.jest,

  preset: 'jest-puppeteer',
  verbose: true,
  testMatch: testMatch,
  setupTestFrameworkScriptFile: './jest.setup.js',

  moduleNameMapper: {
    ...(femenFileConfig.jest || {}).moduleNameMapper,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|less)$':
      path.resolve(__dirname, 'asset-mock'),
  },

  roots: [
    process.cwd(),
  ],
}
