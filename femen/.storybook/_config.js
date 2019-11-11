const fs = require('fs')
const path = require('path')
const glob = require('glob')
const rootFn = require('../utils/rootFn')
const os = require('os')
const verbose = !!process.env.VERBOSE

if (!process.env.TEST_MATCH) {
  throw new Error(`process.env.TEST_MATCH must be set to build femen storybook!`)
}

let testMatch

try {
  testMatch = JSON.parse(decodeURIComponent(process.env.TEST_MATCH))
} catch (e) {
  console.error('TEST_MATCH wasn\'t parsed! Exiting now...', e)
  process.exit()
}

module.exports = () => {
  const moduleSource = fs.readFileSync(require.resolve('./_configTemplate.js'), {
    encoding: 'utf-8'
  })

  const req = testMatch.reduce((acc, pattern) => {
    glob.sync(pattern, { ignore: ['node_modules/**'] }).forEach(filename => {
      if (os.platform() === 'win32') {
        filename = filename.replace(/\\/g, '/')
      }
      if (verbose) {
        console.log('filename', filename)
      }

      const absfn = os.platform() === 'win32' ? path.resolve(process.cwd(), filename).replace(/\\/g, '/')
        : path.resolve(process.cwd(), filename)

      acc += `require('../loaders/namer-loader.js?filename=${rootFn(absfn)}!${absfn}');\n`
    })

    return acc
  }, '\n')

  if (verbose) {
    console.log('req', req)
  }

  const code = moduleSource.replace('__REQ__', req)

  if (verbose) {
    console.log('Storybook config.js generated code:', code)
  }

  return {
    code,
    cacheable: true
  }
}
