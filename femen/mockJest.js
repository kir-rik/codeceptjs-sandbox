const mock = new Proxy(() => {}, {
  apply: () => mock,
  get: () => mock,
  set: () => true,
  construct: () => mock
})

function mockJestFns () {
  ['afterAll', 'afterEach', 'beforeAll', 'beforeEach', 'describe', 'test', 'xdescribe', 'xtest', 'it', 'xit']
    .forEach(key => {
      global[key] = mock
    })
}
module.exports = mockJestFns
module.exports.default = mockJestFns
