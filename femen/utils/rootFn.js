module.exports = (absFn) => {
  return absFn.substr(process.cwd().length + 1)
}
