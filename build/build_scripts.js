const fs = require('fs')
const path = require('path')

const esbuild = require('esbuild')

module.exports = function () {
  const entryPath = path.join(__dirname, '../src/scripts/')
  const outPath = path.join(__dirname, '../dist/assets/js/')

  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath, { recursive: true })
  }

  fs.readdir(entryPath, { withFileTypes: true }, (err, files) => {
    const entryPoints = files
      .filter(file => file.isFile())
      .map(file => `${entryPath}${file.name}`)

    build(entryPoints)
  })

  fs.readdir(`${entryPath}pages/`, { withFileTypes: true }, (err, files) => {
    const entryPoints = files
      .filter(file => file.isFile())
      .map(file => `${entryPath}pages/${file.name}`)

    build(entryPoints)
  })

  const build = entryPoints => {
    esbuild.build({
      entryPoints,
      outdir: outPath,
      bundle: true,
      sourcemap: true,
      minify: true,
      format: 'iife',
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
      watch: true,
      logLevel: 'info',
      treeShaking: true,
    })
  }

  return Promise.resolve()
}
