const path = require('path')
const { execSync } = require('child_process')
const rimraf = require('rimraf')
const os = require('os')
const { storybookDevCli, storybookConfigFolder } = require('../directories')

let NODE_PATH = path.resolve(__dirname, '../')

if (process.env.NODE_PATH) {
  NODE_PATH = `${process.env.NODE_PATH}:${NODE_PATH}`
}

function watchStorybook ({ testMatch, workdir, webpackConfig }) {
  const TEST_MATCH = encodeURIComponent(JSON.stringify(testMatch))
  const setEnv = os.platform() === 'win32' ? 'cross-env' : ''
  let env = `${setEnv} FEMEN_IS_STORYBOOK=true`
  env += ` ${setEnv} NODE_PATH=${NODE_PATH} ${setEnv} TEST_MATCH=${TEST_MATCH}`

  if (webpackConfig) {
    const APP_WEBPACK_CONFIG_PATH = path.resolve(workdir, webpackConfig)
    env += ` ${setEnv} APP_WEBPACK_CONFIG_PATH=${APP_WEBPACK_CONFIG_PATH}`
  }

  const processName = `${env} ${storybookDevCli} -c ${storybookConfigFolder} -p 6006`

  execSync(processName, { stdio: 'inherit' })
}

module.exports = watchStorybook
module.exports.default = watchStorybook
