const fs = require("fs");
const { basename, dirname, extname } = require("path");
const { watch } = require("chokidar");
const run = require("./build");

module.exports = function wailwindWtach(tailwindConfig) {
  let isLog = false;
  let dirIdx = -1;
  let dir = ".";

  process.env.NODE_ENV =
    process.argv.findIndex((a) => a === "-m") > -1 ||
    process.argv.findIndex((a) => a === "--minify") > -1
      ? "production"
      : "";

  process.argv.findIndex((a) => a === "-d");
  if (dirIdx === -1) {
    dirIdx = process.argv.findIndex((a) => a === "--dir");
  }

  if (dirIdx > -1) {
    dir += "/" + process.argv[dirIdx + 1];
  }

  const watcher = watch(dir, {
    ignored:
      /((^|[\/\\])\..)|(node_modules)|(package.json)|(yarn.lock)|(package-lock.json)/,
    persistent: true,
  });

  watcher.on("add", (filepath) => {
    if (basename(filepath) === "config.css") {
      if (basename(dirname(filepath)) === "css") {
        run(filepath, tailwindConfig, isLog);
      }
      return;
    }

    const regex = /html|pug|jsx|tsx|vue/;

    if (extname(filepath).match(regex)) {
      if (fs.existsSync(`${dirname(filepath)}/assets/css/config.css`)) {
        run(
          `${dirname(filepath)}/assets/css/config.css`,
          tailwindConfig,
          isLog
        );
      }
    }

    if (filepath.includes(".blade.php")) {
      if (fs.existsSync(`${dirname(filepath)}/assets/css/config.css`)) {
        run(
          `${dirname(filepath)}/assets/css/config.css`,
          tailwindConfig,
          isLog
        );
      }
    }
  });

  watcher.on("change", (filepath) => {
    if (basename(filepath) === "config.css") {
      if (basename(dirname(filepath)) === "css") {
        run(filepath, tailwindConfig, isLog);
      }
      return;
    }

    const regex = /html|pug|jsx|tsx|vue/;

    if (extname(filepath).match(regex)) {
      if (fs.existsSync(`${dirname(filepath)}/assets/css/config.css`)) {
        run(
          `${dirname(filepath)}/assets/css/config.css`,
          tailwindConfig,
          isLog
        );
      }
    }

    if (filepath.includes(".blade.php")) {
      if (fs.existsSync(`${dirname(filepath)}/assets/css/config.css`)) {
        run(
          `${dirname(filepath)}/assets/css/config.css`,
          tailwindConfig,
          isLog
        );
      }
    }
  });

  watcher.on("ready", () => {
    console.log("Initial scan complete. Ready for changes : " + dir);
    isLog = true;
  });
};
