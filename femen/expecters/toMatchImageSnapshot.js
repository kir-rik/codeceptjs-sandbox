const {configureToMatchImageSnapshot} = require('jest-image-snapshot')
const skipScreenshots = process.env.MAKE_SCREENSHOTS !== 'true'

const toMatchBufferSnapshot = configureToMatchImageSnapshot({
    failureThreshold: 1,
    failureThresholdType: 'pixel',
    noColors: false,
})

module.exports = function () {
    if (skipScreenshots) {
        return {
            message: () => '',
            pass: true
        }
    }
    return toMatchBufferSnapshot.apply(this, arguments)
}
