const storybook = require('@storybook/react')
const e = encodeURIComponent
const namer = require('./utils/namer')
const rootFn = require('./utils/rootFn')
const os = require('os')

const storyMap = {}

function getRenderer (component) {
  if (typeof component === 'function') {
    return component
  }
  return () => component
}

// Возвращает относительный путь файла (относительно папки запуска — корня проекта)
// Например: `spec/example.browser.test.js`
function _getCallerFile() {
  // Jest тоже модифицирует Error.prepareStackTrace, поэтому важно восстанавливать
  // Иначе все падения Jest станут непонятными вида `TypeError: content.match is not a function`
  const oldPrepareStackTrace = Error.prepareStackTrace

  try {
    var err = new Error()
    var callerfile
    var currentfile

    Error.prepareStackTrace = function (err, stack) { return stack }

    currentfile = err.stack.shift().getFileName()

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName()

      if (currentfile !== callerfile) return rootFn(callerfile)
    }
  } catch (err) {
    // pass
  } finally {
    Error.prepareStackTrace = oldPrepareStackTrace
  }

  return undefined
}

// Изоморфная функция: работает как со сторибуком (webpack), так и с jest
function mountInBrowser (...args) {
  const element = args[args.length - 1]
  let absFilename

  if (process.env.FEMEN_IS_STORYBOOK) {
    absFilename = String(args[0])
  } else {
    absFilename = _getCallerFile()
    if (os.platform() === 'win32') {
      absFilename = absFilename.replace(/\\/g, '/')
    }
  }

  storyMap[absFilename] = (storyMap[absFilename] || 0) + 1

  const testCaseName = namer(storyMap[absFilename])
  const componentName = absFilename
  const key = `${componentName}/${testCaseName}`

  const kind = `PUPPETEER_TESTS/${componentName}`
  const renderer = getRenderer(element)

  if (typeof jest === 'undefined') {
    storybook
      .storiesOf(kind)
      .add(testCaseName, renderer)
  }

  return `http://localhost:3001/iframe.html?selectedKind=${e(kind)}&selectedStory=${e(testCaseName)}`
}

module.exports = mountInBrowser
module.exports.default = mountInBrowser
