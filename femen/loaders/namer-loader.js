const { getOptions } = require('loader-utils')
const namer = require('../utils/namer')

module.exports = function(source) {
  const options = getOptions(this)
  const { filename } = options
  let prefix = 'mountInBrowser('

  if (source.includes('mountInBrowser)(')) {
    prefix = 'mountInBrowser)('
  }

  const arr = source.split(prefix)
  const result = arr.reduce((acc, item, index) => {
    acc = acc + item

    if (index < arr.length - 1) {
      acc = acc + `${prefix}'${filename}', `
    }

    return acc
  }, '')

  return result
}
