const stylelint = require('stylelint')

module.exports = function () {
  stylelint
    .lint({ formatter: 'verbose', files: 'src/styles/**/*.pcss' })
    .then(data => console.log(data.output))
    .catch(err => console.error(err.stack))
}
