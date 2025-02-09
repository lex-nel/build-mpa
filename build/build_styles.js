const fs = require('fs')
const path = require('path')

const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const tailwindcss = require('@tailwindcss/postcss')
const prettier = require('prettier')

module.exports = function () {
  fs.readFile('src/styles/index.css', (err, css) => {
    postcss([tailwindcss, autoprefixer])
      .process(css, {
        from: 'src/styles/index.css',
        to: 'dist/assets/css/index.css',
        map: { inline: false },
      })
      .then(result => {
        fs.writeFile('dist/assets/css/index.css', result.css, () => true)
        if (result.map) {
          fs.writeFile(
            'dist/assets/css/index.css.map',
            result.map.toString(),
            () => true,
          )
        }
      })
  })

  const entryPath = path.join(__dirname, '../src/styles/pages/')
  const outPath = path.join(__dirname, '../dist/assets/css/')

  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath, { recursive: true })
  }

  fs.readdir(entryPath, (err, files) => {
    files.forEach(file => {
      const fileName = path.parse(file).name

      fs.readFile(entryPath + file, (err, css) => {
        postcss([tailwindcss, autoprefixer])
          .process(css, {
            from: entryPath + file,
            to: `${outPath}${fileName}.css`,
            map: { inline: false },
          })
          .then(async result => {
            result.css = await prettier.format(result.css, { parser: 'css' })
            fs.writeFile(`${outPath}${fileName}.css`, result.css, () => true)
            if (result.map) {
              fs.writeFile(
                `${outPath}${fileName}.css.map`,
                result.map.toString(),
                () => true,
              )
            }
          })
      })
    })
  })

  return Promise.resolve()
}
