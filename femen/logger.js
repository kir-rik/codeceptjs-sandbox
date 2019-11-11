const yamlifyObject = require('yamlify-object')
const yamlifyColors = require('yamlify-object-colors')

exports.fy = function fy(obj) {
  return yamlifyObject(obj, {
    colors: yamlifyColors,
  })
}
