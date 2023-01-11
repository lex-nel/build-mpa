const chokidar = require("chokidar");
const path = require("path");

const bs = require("browser-sync").create();

const buildTemplates = require("./build_templates");
const buildStyles = require("./build_styles");
const buildScripts = require("./build_scripts");
const buildAssets = require("./build_assets");

const entryPath = path.join(__dirname, "../src/");
const outPath = path.join(__dirname, "../dist/");

bs.init({ server: outPath, port: 3001 });

buildTemplates();
buildStyles();
buildScripts();
buildAssets();

chokidar.watch(entryPath).on("change", (path) => {
  if (path.includes("scripts")) {
    buildScripts().then(() => bs.reload());
  }

  if (path.includes("styles")) {
    buildStyles().then(() => bs.reload());
  }

  if (path.includes("templates")) {
    Promise.all([buildTemplates(), buildStyles()]).then(() => bs.reload());
  }
});
