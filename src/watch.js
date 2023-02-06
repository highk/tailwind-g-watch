const fs = require("fs");
const { basename, dirname, extname } = require("path");
const { watch } = require("chokidar");
const run = require("./build");
const { getDirPath } = require("./utils");

const regexCss = /css|scss|src/;
const regexHtml = /html|pug|jsx|tsx|vue/;

module.exports = function tailwindWtach(tailwindConfig, argv) {
  console.log("Initial scan and build...");
  process.env.NODE_ENV = argv.minify ? "production" : "";
  
  const regexConfigCss = new RegExp(`${argv.input}\\.(css|scss)`);
  console.log(regexConfigCss);

  let isLog = false;

  const watcher = watch(getDirPath(argv), {
    ignored:
      /((^|[\/\\])\..)|(node_modules)|(package.json)|(yarn.lock)|(package-lock.json)/,
    persistent: true,
  });

  watcher.on("add", (filepath) => {
    if (basename(filepath).match(regexConfigCss)) {
      if (basename(dirname(filepath)).match(regexCss)) {
        run(filepath, tailwindConfig, isLog, argv);
        return;
      }
    }
  });

  watcher.on("change", (filepath) => {
    // config.js
    if (basename(filepath) === "config.js") {
      if (fs.existsSync(`${dirname(dirname(filepath))}/css/${argv.input}.css`)) {
        run(
          `${dirname(dirname(filepath))}/css/${argv.input}.css`,
          tailwindConfig,
          isLog,
          argv
        );
        return;
      }

      if (fs.existsSync(`${dirname(dirname(filepath))}/scss/${argv.input}.scss`)) {
        run(
          `${dirname(dirname(filepath))}/scss/${argv.input}.scss`,
          tailwindConfig,
          isLog,
          argv
        );
        return;
      }

      if (fs.existsSync(`${dirname(dirname(filepath))}/src/${argv.input}.scss`)) {
        run(
          `${dirname(dirname(filepath))}/src/${argv.input}.scss`,
          tailwindConfig,
          isLog,
          argv
        );
        return;
      }
    }

    // config.css|scss
    if (basename(filepath).match(regexConfigCss)) {
      console.log(basename(dirname(filepath)));
      if (basename(dirname(filepath)).match(regexCss)) {
        run(filepath, tailwindConfig, isLog, argv);
        return;
      }
    }

    // html|blade.php|vue|jsx|tsx
    if (
      extname(filepath).match(regexHtml) ||
      basename(filepath).includes(".blade.php")
    ) {
      if (fs.existsSync(`${dirname(filepath)}/assets/css/${argv.input}.css`)) {
        run(
          `${dirname(filepath)}/assets/css/${argv.input}.css`,
          tailwindConfig,
          isLog,
          argv
        );
        return;
      }

      if (fs.existsSync(`${dirname(filepath)}/assets/scss/${argv.input}.scss`)) {
        run(
          `${dirname(filepath)}/assets/scss/${argv.input}.scss`,
          tailwindConfig,
          isLog,
          argv
        );
        return;
      }

      if (fs.existsSync(`${dirname(filepath)}/assets/src/${argv.input}.scss`)) {
        run(
          `${dirname(filepath)}/assets/src/${argv.input}.scss`,
          tailwindConfig,
          isLog,
          argv
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
