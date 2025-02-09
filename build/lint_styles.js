const stylelint = require('stylelint')

module.exports = function () {
  stylelint
    .lint({ formatter: 'verbose', files: 'src/styles/**/*.css' })
    .then(data => console.log(data.report))
    .catch(err => console.error(err.stack))
}
