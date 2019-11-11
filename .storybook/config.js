require('whatwg-fetch')
import { configure, addDecorator, addParameters } from '@storybook/react'
import { create } from '@storybook/theming'
import { withInfo } from '@storybook/addon-info'
import { withKnobs } from '@storybook/addon-knobs'

const getComponentApp = () => {
  // ищем сторисы внутри packages, игнорируя node_modules
  const packages = require.context(
    '../packages/loans/src',
    true,
    /^(?!.*\/(node_modules|lib)\/).*\.stories\.js$/
  )

  packages.keys().forEach(filename => packages(filename))
}

addDecorator(
  withInfo({
    inline: false,
  })
)
addDecorator(
  withKnobs({
    escapeHTML: false,
  })
)

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'Test',
      brandUrl: '../index.html',
      // To control appearance:
      // brandImage: 'http://url.of/some.svg',
    }),
    isFullscreen: false,
    panelPosition: 'bottom',
  },
})

function loadStories() {
  getComponentApp()
}

configure(loadStories, module)
