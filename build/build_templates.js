const fs = require('fs')
const path = require('path')

const { Liquid } = require('liquidjs')
const prettier = require('prettier')

const entryPath = path.join(__dirname, '../src/templates/pages')
const outPath = path.join(__dirname, '../dist/')

module.exports = function () {
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath, { recursive: true })
  }

  const engine = new Liquid({
    root: [
      path.resolve(__dirname, '../src/templates/_layouts'),
      path.resolve(__dirname, '../src/templates/_includes'),
      path.resolve(__dirname, '../src/templates/pages'),
    ],
    extname: '.liquid',
    cache: true,
  })
  engine.registerFilter('jsonToObject', json => JSON.parse(json))

  fs.readdir(entryPath, (err, files) => {
    files.forEach(file => {
      const fileName = path.parse(file).name

      engine.renderFile(fileName).then(html => {
        html = prettier.format(html, {
          parser: 'html',
          singleAttributePerLine: true,
          htmlWhitespaceSensitivity: 'ignore',
        })
        fs.writeFile(`${outPath}${fileName}.html`, html, () => true)
      })
    })
  })

  return Promise.resolve()
}
