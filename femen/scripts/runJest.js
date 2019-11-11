const path = require('path')
const { execSync } = require('child_process')
const boxen = require('boxen')
const os = require('os')
const { jestCli } = require('../directories')

const JEST_PUPPETEER_CONFIG = path.resolve(__dirname, '..', 'configs', 'jest-puppeteer.config.js')
let NODE_PATH = path.resolve(__dirname, '..')

if (process.env.NODE_PATH) {
  NODE_PATH = `${process.env.NODE_PATH}:${NODE_PATH}`
}
const MAKE_SCREENSHOTS = process.env.MAKE_SCREENSHOTS

function runJest(testPathPattern, { testMatch, debug, verbose, configPath, setupTestFrameworkScriptFile, workdir }) {
  const TEST_MATCH = encodeURIComponent(JSON.stringify(testMatch))
  const setEnv = os.platform() === 'win32' ? 'cross-env' : ''
  let env = `${setEnv} FEMEN_IS_JEST=true MAKE_SCREENSHOTS=${MAKE_SCREENSHOTS} NODE_PATH=${NODE_PATH}`
  env = `${env} JEST_PUPPETEER_CONFIG=${JEST_PUPPETEER_CONFIG} TEST_MATCH=${TEST_MATCH} PUPPETEER_DEV=${debug || ''}`
  env = `${env} FEMEN_CONFIG_PATH=${configPath}`
  if (setupTestFrameworkScriptFile) {
    try {
      // пытаемся разресолвить файл setupTestFrameworkScriptFile относительно workdir
      // и если есть - прокидываем путь к нему в FEMEN_JEST_SETUP
      const FEMEN_JEST_SETUP = require.resolve(setupTestFrameworkScriptFile, {
        paths: [workdir]
      })
      env = `${env} FEMEN_JEST_SETUP=${FEMEN_JEST_SETUP}`
    } catch (e) {
      // Конкретнее сообщаем что проблема с setupTestFrameworkScriptFile конфигом, который не нашелся
      throw new Error('Не найден файл setupTestFrameworkScriptFile')
    }
  }
  let cmd = `${env} ${jestCli} --config ${path.resolve(__dirname, '..', 'configs', 'jest.config.js')} --runInBand`

  if (testPathPattern) {
    console.log(boxen(`Custom testPathPattern: ${testPathPattern}`, {
      padding: 1,
      margin: 1,
      borderColor: 'green',
    }))

    cmd += ` --testPathPattern "${testPathPattern}"`
  }

  if (verbose) {
    console.log('Jest cmd: ', cmd)
  }

  execSync(cmd, { stdio:'inherit' })
}

module.exports = runJest
module.exports.default = runJest
