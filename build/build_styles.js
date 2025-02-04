const fs = require('fs')
const path = require('path')

const postcss = require('postcss')
const postcssImport = require('postcss-import')
const autoprefixer = require('autoprefixer')
const postcssNested = require('postcss-nested')
const postcssReporter = require('postcss-reporter')
const tailwindcss = require('tailwindcss')
const prettier = require('prettier')

module.exports = function () {
  fs.readFile('src/styles/index.css', (err, css) => {
    postcss([postcssImport, postcssNested, autoprefixer, tailwindcss])
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
        postcss([postcssNested, postcssImport(), autoprefixer, tailwindcss])
          .process(css, {
            from: entryPath + file,
            to: `${outPath}${fileName}.css`,
            map: { inline: false },
          })
          .then(async result => {
            result.css = await prettier.format(result.css, { parser: 'css' })
            console.log(result.css)
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
