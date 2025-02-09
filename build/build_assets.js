const fs = require('fs')
const path = require('path')

module.exports = function () {
  const entryPath = path.join(__dirname, '../src/assets/')
  const outPath = path.join(__dirname, '../dist/assets/')

  return fs.cp(entryPath, outPath, { force: true, recursive: true }, () => {})
}
