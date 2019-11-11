const toMatchImageSnapshot = require('./toMatchImageSnapshot')
const skipScreenshots = process.env.MAKE_SCREENSHOTS !== 'true'
const injectScreenshotStyles = async () => {
  await page.addStyleTag({
    content: `
      *, *::after, *::before {
        transition: none !important;
        animation: none !important;
        caret-color: transparent !important;
      }
    `,
  })
}
const getSelectorClip = async (selector, padding) => {
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector)
    if (!element) {
      return null
    }
    const {x, y, width, height} = element.getBoundingClientRect()
    return {left: x, top: y, width, height, id: element.id}
  }, selector)

  if (!rect) {
    throw Error(`Could not find element that matches selector: ${selector}.`)
  }
  return {
    x: rect.left - padding,
    y: rect.top - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  }
}

module.exports = async function (received, options = {}) {
  if (skipScreenshots) {
    return {
      message: () => '',
      pass: true
    }
  }
  let imageBuffer
  if (received === global.page) {
    imageBuffer = await page.screenshot({fullPage: !!options.fullPage})
  } else if (typeof received === 'string') {
    imageBuffer = await page.screenshot({clip: await getSelectorClip(received, options.padding || 0)})
  } else {
    imageBuffer = received
  }

  await injectScreenshotStyles()
  return toMatchImageSnapshot.call(this, imageBuffer)
}
