// Файл под .dockerignore
// Изменения не должны сбрасывать кеш при сборке образа

const fs = require('fs')
const path = require('path')
const config = require('../config')
const version = require('../package.json').version
const { execSync } = require('child_process')
const commandExistsSync = require('command-exists').sync

const dockerExists = commandExistsSync('docker')
const isDev = fs.existsSync(path.resolve(__dirname, '..', 'isdev'))

module.exports = (cmdInDocker) => {
  if (config.verbose) {
    console.log('cmdInDocker:', cmdInDocker)
  }

  if (!dockerExists) {
    console.error('Docker not found! Forgot to install it? https://docs.docker.com/install')
  }

  if (isDev) {
    console.log('Docker detected! Running ci in docker')
    execSync(`docker build -t femen/femen:dev ${path.resolve(__dirname, '..')}`, { stdio: 'inherit' })
    console.log('Docker built!')
  }
  const tag = isDev ? 'dev' : version

  let mount = `-v ${process.cwd()}:/app`

  if (isDev) {
    mount = `${mount} -v ${path.resolve(__dirname, '..')}:/app/node_modules/femen`
  }

  const opts = `--shm-size 1G --rm -p 3001:3001 -i -t ${mount}`
  const cmd = `docker run ${opts} femen/femen:1.16.2 bash -c "./node_modules/.bin/femen ${cmdInDocker}"`

  if (config.verbose) {
    console.log('Docker cmd:', cmd)
  }

  execSync(cmd, { stdio: 'inherit' })
}
