const fs = require("fs");
const { basename, dirname, extname } = require("path");
const { watch } = require("chokidar");
const run = require("./build");

module.exports = function wailwindWtach(tailwindConfig) {
  console.log("Initial scan and build...");

  const regexConfigCss = /config\.(css|scss)/
  const regexCss = /css|scss/
  const regexHtml = /html|pug|jsx|tsx|vue/;

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
    if (basename(filepath).match(regexConfigCss)) {
      if (basename(dirname(filepath)).match(regexCss)) {
        run(filepath, tailwindConfig, isLog);
        return;
      }
    }
  });

  watcher.on("change", (filepath) => {
    // config.js
    if (basename(filepath) === "config.js") {
      if (fs.existsSync(`${dirname(dirname(filepath))}/css/config.css`)) {
        run(`${dirname(dirname(filepath))}/css/config.css`, tailwindConfig, isLog);
        return;
      }
      if (fs.existsSync(`${dirname(dirname(filepath))}/scss/config.scss`)) {
        run(`${dirname(dirname(filepath))}/scss/config.scss`, tailwindConfig, isLog);
        return;
      }
    }

    // config.css|scss
    if (basename(filepath).match(regexConfigCss)) {
      if (basename(dirname(filepath)).match(regexCss)) {
        run(filepath, tailwindConfig, isLog);
        return;
      }
    }

    // html|blade.php|vue|jsx|tsx
    if (extname(filepath).match(regexHtml) || basename(filepath).includes(".blade.php")) {
      if (fs.existsSync(`${dirname(filepath)}/assets/css/config.css`)) {
        run(
          `${dirname(filepath)}/assets/css/config.css`,
          tailwindConfig,
          isLog
        );
        return;
      }

      if (fs.existsSync(`${dirname(filepath)}/assets/scss/config.scss`)) {
        run(
          `${dirname(filepath)}/assets/scss/config.scss`,
          tailwindConfig,
          isLog
        );
        return;
      }
    }
  });

  watcher.on("ready", () => {
    console.log("Initial scan complete. Ready for changes : " + dir);
    isLog = true;
  });
};
