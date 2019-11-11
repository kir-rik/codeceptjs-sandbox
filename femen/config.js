const fs = require('fs')
const path = require('path')
const argv = require('yargs').argv

function assign(...args) {
  args.forEach((arg) => {
    for (let key in arg) {
      if (arg[key] === undefined) {
        delete arg[key]
      }
    }
  })

  return Object.assign.apply(this, args)
}

let fileConfig = {}
let configPath

try {
  const configfn = argv.config || 'femen.config.js'
  configPath = path.resolve(process.cwd(), configfn)

  fileConfig = require(configPath)
} catch (e) {
  // pass
}

const defaultConfig = {
  jest: {},
  setupTestFrameworkScriptFile: '',
  workdir: process.cwd(),
  testMatch: ['**/browser-tests/*.spec.js'],
  isDocker: process.env.FEMEN_IN_DOCKER,
  webpackConfig: '.storybook/webpack.config.js',
  configPath,
}

const argvConfig = {
  verbose: argv.verbose,
  workdir: argv.workdir,
  docker: argv._[0] === 'docker',
}
const config = assign({}, defaultConfig, fileConfig, argvConfig)

module.exports = config
