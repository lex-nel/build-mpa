const chokidar = require("chokidar");
const path = require("path");

const bs = require("browser-sync").create();

const buildTemplates = require("./build_templates");
const buildStyles = require("./build_styles");
const buildScripts = require("./build_scripts");

const entryPath = path.join(__dirname, "../src/");
const outPath = path.join(__dirname, "../dist/");

bs.init({ server: outPath, port: 3001 });

chokidar.watch(entryPath).on("all", (event, path) => {
  console.log("\nThe file", path, "was modified!");
  console.log("The type of change was:", event);

  buildTemplates();
  buildStyles();
  buildScripts();

  setTimeout(() => {
    bs.reload();
  }, 1000);
});
