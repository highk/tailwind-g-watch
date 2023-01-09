const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const { dirname } = require("path");
const { mkdir, writeFile, readFile } = require("fs/promises");
const productionPostcssPlugins = require("./postcss.plugins.production");
const defaultPostcssPlugins = require("./postcss.plugins");
const tailwindPlugins = require("./taliwind.plugins");
const postcssScssSyntax = require('postcss-scss')

async function run(configPath, tailwindConfig) {
  const isProdction = process.env.NODE_ENV === "production";
  const tailwindPostcssPlugin = tailwindcss({
    content: [
      `${dirname(dirname(dirname(configPath)))}/*.{html,blade.php,jsx,tsx,pug}`,
    ],
    ...tailwindPlugins,
    ...tailwindConfig,
  });

  const postcssContent = await readFile(configPath);
  const postcssPlugins = [...defaultPostcssPlugins, tailwindPostcssPlugin];

  if (isProdction) {
    postcssPlugins.push(...productionPostcssPlugins);
  }

  const cssContent = await postcss(postcssPlugins).process(postcssContent, {
    from: configPath,
    to: `${dirname(dirname(configPath))}/css/index.dist.css`,
    map: true,
    syntax: postcssScssSyntax
  });

  await mkdir(`${dirname(dirname(configPath))}/css`, { recursive: true });
  await writeFile(
    `${dirname(dirname(configPath))}/css/index.dist.css`,
    cssContent.css
  );
}

// Alreay run? (first argument)
function PreventDuplicateExecutionAsync(func) {
  const running = new Map();
  const next = new Map();
  return async function () {
    const args = [...arguments];

    if (running.get(args[0])) {
      next.set(args[0], true);
      return await running.get(args[0]);
    } else {
      let result;
      let err;
      do {
        next.delete(args[0]);
        result = undefined;
        err = undefined;
        const promise = func(...args);
        running.set(args[0], promise);
        try {
          result = await promise;
        } catch (e) {
          err = e;
        }
        running.delete(args[0]);
      } while (next.get(args[0]));
      if (err) {
        throw err;
      } else {
        return result;
      }
    }
  };
}

module.exports = PreventDuplicateExecutionAsync(async function (configPath, tailwindConfig, isLog) {
  if (isLog !== false) console.log("processing " + configPath);
  await run(configPath, tailwindConfig);
});
