const fs = require("fs");
const { basename, dirname, extname } = require("path");
const { watch } = require("chokidar");
const run = require("./build");
const { getDirPath } = require("./utils");

const regexConfigCss = /config\.(css|scss)/;
const regexCss = /css|scss/;
const regexHtml = /html|pug|jsx|tsx|vue/;

module.exports = function wailwindWtach(tailwindConfig, argv) {
  console.log("Initial scan and build...");
  process.env.NODE_ENV = argv.minify ? "production" : "";

  let isLog = false;

  const watcher = watch(getDirPath(argv), {
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
        run(
          `${dirname(dirname(filepath))}/css/config.css`,
          tailwindConfig,
          isLog
        );
        return;
      }
      if (fs.existsSync(`${dirname(dirname(filepath))}/scss/config.scss`)) {
        run(
          `${dirname(dirname(filepath))}/scss/config.scss`,
          tailwindConfig,
          isLog
        );
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
    if (
      extname(filepath).match(regexHtml) ||
      basename(filepath).includes(".blade.php")
    ) {
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
    console.log(
      "Initial scan complete. Ready for changes : " + getDirPath(argv)
    );
    isLog = true;
  });
};
