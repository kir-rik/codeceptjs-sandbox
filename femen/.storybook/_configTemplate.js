require('babel-polyfill')
const { configure } = require('@storybook/react')
require('../mockJest')()

function loadStories () {
  // @see ./_config.js
  __REQ__
}

configure(loadStories, module)
