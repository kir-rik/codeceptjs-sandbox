const ProxyPolyfill = require('proxy-polyfill/src/proxy')

const P = ProxyPolyfill()

class MockGlobalFunc {
  static only() {}
  // Добавлен для того чтобы можно было вызывать only сценарии для Data
  only = {
    Scenario() {},
  }
  add() {}
  xadd() {}
  filter() {}
  Scenario() {}
}

const mock = new P(MockGlobalFunc, {
  apply: () => new MockGlobalFunc(),
  get: () => mock,
  set: () => true,
  construct: () => new MockGlobalFunc(),
})

function mockJestFns() {
  ;[
    'afterAll',
    'afterEach',
    'beforeAll',
    'beforeEach',
    'describe',
    'test',
    'xdescribe',
    'xtest',
    'it',
    'xit',
    'Feature',
    'Scenario',
    'xScenario',
    'Data',
    'xData',
    'Before',
    'BeforeSuite',
    'After',
    'AfterSuite',
    'DataTable',
    'locate',
  ].forEach(key => {
    global[key] = mock
  })
}
module.exports = mockJestFns
module.exports.default = mockJestFns
