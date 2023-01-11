const { ESLint } = require('eslint')

module.exports = async function () {
  const eslint = new ESLint()

  const results = await eslint.lintFiles(['src/scripts/**/*.ts'])
  const formatter = await eslint.loadFormatter('stylish')
  const resultText = formatter.format(results)

  console.log(resultText)
}
