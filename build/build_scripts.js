const fs = require('fs')
const path = require('path')

const esbuild = require('esbuild')

module.exports = function () {
  // Получение пути от куда брать скрипты
  const entryPath = path.join(__dirname, '../src/scripts/')
  // Получение пути куда класть скрипты
  const outPath = path.join(__dirname, '../dist/assets/js/')

  // Проверка существования папки куда класть скрипты
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
      logLevel: 'info',
      treeShaking: true,
    })
  }

  return Promise.resolve()
}
