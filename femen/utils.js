// Удобняшки для тестов

// Прокси, который заменяет `page.$(s.selector)` на `el.selector`
const handler = {
  get: (obj, prop) => {
    return page.$(obj[prop])
  },
}

exports.getProxy = (s) => new Proxy(s, handler)

// Возвращает положение каретки по селектору
exports.getCaretStart = async (selector) =>
  page.$eval(selector, (element) => (element.selectionStart))

// Проверяет, в фокусе ли элемент по селектору selector
exports.isFocused = async (selector) => (
  page.$eval(selector, element => element === document.activeElement)
)

// Возвращает true только если ни одного элемента в доме нет
exports.areHidden = async function areHidden (...args) {
  return Promise.all(
    args.map(selector => page.$(selector))
  ).then(elements => elements.every(el => el === null))
}

// Возвращает true только если все элементы есть в доме и они видимы (не display: none или типа того)
// В противном случае бросает ошибку
exports.areVisible = async function areVisible (...args) {
  await Promise.all(
    args.map(selector => page.waitForSelector(selector, { visible: true }))
  )

  return true
}

// Возвращает значение атрибута value для элемента по селектору
exports.value = async function value (selector) {
  return page.$eval(selector, (el) => el.value)
}

exports.waitForValue = async function waitForValue (selector, timeout = 1000) {
  return page.waitForFunction((el) => Boolean(el.value), { timeout: timeout }, await page.$(selector))
}

// Возвращает значение свойства innerHtml для элемента по селектору
exports.html = async function html (selector, options) {
  const t = await page.$eval(selector, el => (el && el.innerHTML || `element '${selector}' not found`))

  if (options && options.raw) {
    return t
  }

  return t.trim()
}

// Возвращает значение свойства innerText для элемента по селектору, либо 'element not found'
exports.text = async function text (selector, options) {
  const t = await page.$eval(selector, el => (el && el.innerText || `element '${selector}' not found`))

  if (options && options.raw) {
    return t
  }

  return t.trim()
}

// Возвращает .getBoundingClientRect() для элемента по селектору
exports.rect = async function rect (selector) {
  const DOMRect = await page.evaluate((el) => ({
    top: el.getBoundingClientRect().top,
    left: el.getBoundingClientRect().left,
    width: el.getBoundingClientRect().width,
    height: el.getBoundingClientRect().height,
  }), await page.$(selector))

  return DOMRect
}

// Возвращает true, если селектор появляется на странице за время timeout
// Дефолтно просто проверяет, есть ли селектор прямо сейчас
// Этотй утилзой пользоваться лучше, чем page.waitForSelector,
// потому что waitForSelector, при падении, пишет непонятные логи
// Дефолтный таймаут такой большой, потому что
// в хромиуме даже замоканные реквесты могут проходить больше чем за 1 секунду ¯\_(ツ)_/¯
exports.isVisible = async function isVisible (selector, timeout = 1500) {
  try {
    await sleep(10) // Ждём преобразований реакта @todo слушать обновление дома напрямую, а не надеяться на таймаут
    const el = await page.waitForSelector(selector, { visible: true, timeout })

    return !!el
  } catch (e) {
    console.error(`Selector "${selector}" not exists`)

    return false
  }
}

// Срабатывает быстрее isVisible – в этом весь смысл
exports.isHidden = async function isHidden (selector, timeout = 100) {
  try {
    await sleep(10) // Ждём преобразований реакта @todo слушать обновление дома напрямую, а не надеяться на таймаут
    const el = await page.waitForSelector(selector, { visible: true, timeout })

    return !el
  } catch (e) {
    return true
  }
}

exports.length = async function length (selector) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout: 1000 })
    const l = await page.evaluate((s) => (document.querySelectorAll(s).length), selector)

    return l
  } catch (e) {
    return e
  }
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

// Печатает, но медленно, чтоб контролируемые инпуты не глючило от скорости
exports.slowType = async function slowType (el, s, interval = 10) {
  let str = s
  let element = el

  if (typeof element === 'string') {
    str = el
    element = null
  }

  await asyncForEach(str.split(''), async (char) => {
    if (element) {
      await element.type(char)
    } else {
      await page.keyboard.type(char)
    }
    await sleep(interval)
  })
}

exports.repeatPress = async function repeatPress (key, repeatCount) {
  for (let i = 0; i < repeatCount; i++) {
    await page.keyboard.press(key)
  }
}

exports.sleep = (time = 0) => new Promise((resolve) => setTimeout(resolve, time))

exports.hasClass = (currentClass, seekingClass) =>
  page.$eval(currentClass, (el, anotherClass) => el.classList.contains(anotherClass), seekingClass)

exports.isMac = async function isMac () {
  const result = await page.evaluate((s) => (navigator.platform && navigator.platform.toUpperCase().indexOf(s) > 0), 'MAC')
  return result
}
