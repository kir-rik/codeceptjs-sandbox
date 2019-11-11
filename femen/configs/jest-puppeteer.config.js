const path = require('path')

const femenConfigPath = process.env.FEMEN_CONFIG_PATH
const isDev = !!process.env.PUPPETEER_DEV

let femenFileConfig = {}
const headless = !isDev

const serverPath = path.resolve(__dirname, '..', 'scripts', 'runStorybook.js')
const executablePath = process.env.PUPPETEER_EXEC_PATH

console.log(`
  executablePath: ${executablePath}
`)

try {
  femenFileConfig = require(femenConfigPath)
} catch (e) {
  // pass
}

const userConfig = femenFileConfig['jest-puppeteer'] || {}

const config = {
  exitOnPageError: false,

  ...userConfig,

  server: {
    command: `node ${serverPath}`,
    port: 3001,
    launchTimeout: 30 * 1000,

    ...userConfig.server,
  },
  launch: {
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--ignore-certificate-errors',
      '--allow-insecure-localhost',
    ],
    ignoreHTTPSErrors: true,
    dumpio: isDev,
    devtools: isDev,
    headless: !isDev,
    executablePath,

    ...userConfig.launch,
  },
}

if (isDev && typeof userConfig.slowMo === 'undefined') {
  config.slowMo = 200
}

module.exports = config
