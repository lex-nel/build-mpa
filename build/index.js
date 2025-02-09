const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const browserSync = require('browser-sync')
const buildTemplates = require('./build_templates')
const buildStyles = require('./build_styles')
const buildScripts = require('./build_scripts')
const buildAssets = require('./build_assets')
const lintScripts = require('./lint_scripts')
const lintStyles = require('./lint_styles')

const entryPath = path.join(__dirname, '../src/')
const outPath = path.join(__dirname, '../dist/')

const bs = browserSync.create()
bs.init({
  open: false,
  port: 3000,
  server: {
    baseDir: outPath,
    index: 'home.html',
    serveStaticOptions: {
      extensions: ['html'],
    },
  },

  middleware: [
    function (req, res, next) {
      if (/\/catalog\/\d/.test(req.url)) {
        const body = fs.readFileSync(`${outPath}product.html`, (err, body) => {
          return body
        })

        res.end(body)
      }

      next()
    },
  ],
})

// Запуск сборки при первом запуске
buildTemplates() // Сборка html
buildStyles() // Сборка стилей
buildScripts() // Сборка скриптов
buildAssets() // Копирование асетов

// Запуск линтинга при первом запуске
lintScripts() // Линтинг скриптов
lintStyles() // Линтинг стилей

// Запуск сборки при изменении исходных файлов
chokidar.watch(entryPath).on('change', path => {
  if (path.includes('scripts')) {
    // Линтинг скриптов
    lintScripts()

    // Сборка скриптов
    buildScripts().then(() => bs.reload())
  }

  if (path.includes('styles')) {
    // Линтинг стилей
    lintStyles()

    // Сборка стилей
    buildStyles().then(() => bs.reload())
  }

  if (path.includes('templates')) {
    // Сборка html и стилей
    Promise.all([buildTemplates(), buildStyles()]).then(() => bs.reload())
  }

  if (path.includes('assets')) {
    // Копирование асетов
    buildAssets()
  }
}).on('add', path => {
  if (path.includes('assets')) {
    // Копирование асетов
    buildAssets()
  }
})
