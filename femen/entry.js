#!/usr/bin/env node

/*
 * Отвечает за выбор femen
 * 1) Глобальный (/usr/bin/...), если мы в докере
 * 2) Из текущей папки в остальных случаях
 */

const path = require('path')
const { execSync } = require('child_process')

let executable = path.resolve(__dirname, 'cli.js')

// @todo
// if (process.env.FEMEN_IN_DOCKER) {
//   // В докере всегда берем глобальный femen
//   // Иначе, если в проекте есть локальный femen, может запуститься он (ведь мы маунтим папку проекта в докер)
//   executable = '/usr/local/lib/node_modules/femen/cli.js'
// }

require(executable)

// @todo
process.on('SIGINT', () => {
  console.log('Cmd + C? Exiting ASAP!')
  process.exit()
})

process.on('SIGTERM', () => {
  console.log('Cmd + C? Exiting ASAP!')
  process.exit()
})
