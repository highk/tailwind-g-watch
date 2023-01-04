const { dirname } = require("path");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const postcssImportPlugin = require("postcss-import");
const postcssNestingPlugin = require("tailwindcss/nesting/index.js");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcssPresetEnvPlugin = require("postcss-preset-env");
const postcssDiscardCommentsPlugin = require("postcss-discard-comments");
const { readFile, writeFile } = require("./utils.js");
const tailwindPlugins = require("./taliwind.plugins");

const productionPostcssPlugins = [
  postcssDiscardCommentsPlugin({
    removeAll: true,
  }),
  cssnano({
    preset: "cssnano-preset-advanced",
  }),
  postcssPresetEnvPlugin({
    browsers: ["ie 10", "> 2%", "last 2 versions"],
    features: { "nesting-rules": false },
  }),
  autoprefixer,
];

async function run(configPath, tailwindConfig) {
  const isProdction = process.env.NODE_ENV === "production";
  const tailwindPlugin = tailwindcss({
    content: [
      `${dirname(dirname(dirname(configPath)))}/*.{html,blade.php,jsx,tsx,pug}`,
    ],
    ...tailwindPlugins,
    ...tailwindConfig,
  });

  const postcssContent = await readFile(configPath);
  const postcssPlugins = [
    postcssImportPlugin,
    postcssNestingPlugin,
    tailwindPlugin,
  ];

  if (isProdction) {
    postcssPlugins.push(...productionPostcssPlugins);
  }

  const cssContent = await postcss(postcssPlugins).process(postcssContent, {
    from: configPath,
    to: `${dirname(configPath)}/index.dist.css`,
  });

  await writeFile(`${dirname(configPath)}/index.dist.css`, cssContent.css);
}

// Alreay run? (first argument)
function dedupAsync(func) {
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

module.exports = dedupAsync(async function (configPath, tailwindConfig, isLog) {
  if (isLog !== false) console.log("processing " + configPath);
  await run(configPath, tailwindConfig);
});
