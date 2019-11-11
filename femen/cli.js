const version = require('./package.json').version
const config = require('./config')
const boxen = require('boxen')
const { fy } = require('./logger')
const argv = require('yargs')
  .usage('Usage: femen <command> [options]')
  .command('ci', 'Run all browser tests in headless mode')
  .command('debug', 'Run all browser tests in chromium')
  .example('femen ci path/to/header.test.js', 'Run `header` test in headless mode')
  .demandCommand(1, 'You need at least one command before moving on')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2018')
  .argv

console.log(boxen(`femen ${version}

executable: ${__filename}

config: ${fy(config)}`, {
  padding: 1,
  margin: 1,
  borderColor: 'green',
}))

if (config.docker) {
  // `./entry docker run test -a -b` → `run test -a -b`
  const cmdInDocker = process.argv.slice(3).join(' ')

  require('./scripts/run-docker')(cmdInDocker)

  return
}

const command = argv._[0]
const argRe = argv._[1]

switch (command) {
  case 'build':
    require('./scripts/buildStorybook')(config)
    break
  case 'watch':
    require('./scripts/watchStorybook')(config)
    break
  case 'ci':
    require('./scripts/buildStorybook')(config)
    require('./scripts/runJest')(argRe, config)
    break
  case 'run':
    require('./scripts/runJest')(argRe, config)
    break
  // @todo
  case 'debug':
    require('./scripts/runJest')(argRe, { ...config, debug: true })
    break
  case 'storybook':
  case 'book':
    require('./scripts/runStorybook')
    break
  default:
    // pass
}
