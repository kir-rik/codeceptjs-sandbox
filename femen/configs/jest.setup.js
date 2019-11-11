require('babel-polyfill')

expect.extend(
  Object.assign(
    {
      toMatchScreenshot: require('../expecters/toMatchScreenshot'),
      toMatchImageSnapshot: require('../expecters/toMatchImageSnapshot')
    },
    require('../expecters/all')
  )
)

jest.setTimeout(process.env.DEBUG ? 9999999 : 30 * 1000)

if (process.env.FEMEN_JEST_SETUP) {
  require(process.env.FEMEN_JEST_SETUP)
}
