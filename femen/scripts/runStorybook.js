const path = require('path')
const serve = require('serve')
const { storybookStatic } = require('../directories')

const server = serve(storybookStatic, {
  port: 3001,
  ignore: ['node_modules'],
})
