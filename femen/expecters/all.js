const timeout = 5000;

const PASS = (message = '') => ({
  pass: true,
  message: () => message
});
const FAIL = (message = 'TODO') => ({
  pass: false,
  message: () => message
});

module.exports.waitFor = async function (fn, ...args) {
  try {
    await page.waitFor(fn, {timeout}, ...args)
    return PASS()
  } catch (e) {
    return FAIL(e.message)
  }
}

module.exports.toBeFocused = async function (selector) {
  try {
    await page.waitForFunction(
      (selector) => Boolean(document.querySelector(selector) === document.activeElement),
      {timeout},
      selector
    )

    return PASS()
  } catch (e) {
    return FAIL(`Selector ${selector} is not focused`)
  }
}

module.exports.toBeUnFocused = async function (selector) {
  try {
    await page.waitForFunction(
      (selector) => Boolean(document.querySelector(selector) !== document.activeElement),
      {timeout},
      selector
    )

    return PASS()
  } catch (e) {
    return FAIL(`Selector ${selector} is not unfocused`)
  }
}

module.exports.notExists = async function (selector) {
  try {
    await page.waitForFunction(selector => !document.querySelector(selector), {timeout}, selector)

    return PASS()
  } catch (e) {
    return FAIL(e.message)
  }
}

module.exports.toBeHidden = async function (selector) {
  try {
    await page.waitForSelector(selector, {visible: false, timeout})

    return PASS()
  } catch (e) {
    return FAIL(e.message)
  }
}

module.exports.toBeVisible = async function (selector) {
  try {
    if (selector.xpath) {
      await page.waitForXPath(selector.xpath, {visible: true, timeout})
    } else {
      await page.waitForSelector(selector, {visible: true, timeout})
    }
    return PASS()
  } catch (e) {
    return FAIL(e.message)
  }
}
module.exports.toHaveValue = async function (selector, val) {
  try {
    // TODO сделать отдельное сообщение об ошибке в случае не нахождения селектора
    await page.waitForSelector(selector, {timeout})
    await page.waitForFunction(
      (el, v) => Boolean(v ? (el && el.value === v) : (el && el.value)),
      {timeout},
      await page.$(selector),
      val
    )

    return PASS()
  } catch (e) {

    return FAIL(e.message)
  }
}
module.exports.toHaveEmptyValue = async function (selector) {
  try {
    // TODO сделать отдельное сообщение об ошибке в случае не нахождения селектора
    await page.waitForSelector(selector, {timeout})
    await page.waitForFunction(
      (el) => Boolean((el && !el.value)),
      {timeout},
      await page.$(selector),
    )

    return PASS()
  } catch (e) {

    return FAIL(e.message)
  }
}
module.exports.toHaveClass = async function (selector, seekingClass) {
  try {
    await page.waitForSelector(selector, {timeout})
    await page.waitForFunction(
      (selector, anotherClass) => document.querySelector(selector).classList.contains(anotherClass),
      {timeout},
      selector,
      seekingClass
    )
    return PASS()
  } catch (e) {
    return FAIL(`selector ${selector} hasnt class ${seekingClass}`)
  }
}
module.exports.toClick = async function (selector) {
  try {
    await page.waitForSelector(selector, {timeout})
    await page.click(selector)
    return PASS()
  } catch (e) {
     return FAIL(e.message)
  }
}
module.exports.toBeOnPage = async function (text) {
  try {
    await page.waitForFunction(
      (text) => window.find(text),
      { timeout },
      text
    )
    return PASS()
  } catch (e) {
    return FAIL(e.message)
  }
}
