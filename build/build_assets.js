const fse = require("fs-extra");
const path = require("path");

module.exports = function () {
  const entryPath = path.join(__dirname, "../src/assets/");
  const outPath = path.join(__dirname, "../dist/assets/");

  return fse.copy(entryPath, outPath, { overwrite: true });
};
