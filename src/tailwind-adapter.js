const { dirname } = require("path");
const productionPostcssPlugins = require("./postcss.plugins.production");
const defaultPostcssPlugins = require("./postcss.plugins");
const tailwindPlugins = require("./taliwind.plugins");

function loadOptional(packageName) {
  try {
    return require(packageName);
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") throw error;
    if (packageName === "@tailwindcss/postcss" && Number(process.versions.node.split(".")[0]) < 20) {
      throw new Error("Tailwind CSS v4 builds require Node.js 20 or newer and @tailwindcss/postcss.");
    }
    throw new Error(`Install ${packageName} to build Tailwind CSS v4 projects.`);
  }
}

function buildV3Plugins({ configPath, tailwindConfig, isProduction }) {
  const tailwindcss = require("tailwindcss");
  const tailwindPostcssPlugin = tailwindcss({
    content: [
      `${dirname(dirname(dirname(configPath)))}/*.{html,blade.php,jsx,tsx,pug}`,
    ],
    ...tailwindPlugins,
    ...tailwindConfig,
  });
  const postcssPlugins = [...defaultPostcssPlugins, tailwindPostcssPlugin];

  if (isProduction) {
    postcssPlugins.push(...productionPostcssPlugins);
  }

  return postcssPlugins;
}

function buildV4Plugins({ configPath }) {
  const tailwindPostcss = loadOptional("@tailwindcss/postcss");

  return [
    tailwindPostcss({
      base: dirname(dirname(dirname(configPath))),
    }),
  ];
}

function usesTailwindV4EntryPoint(cssContent) {
  return /@import\s+["']tailwindcss["']/.test(cssContent);
}

function buildPostcssPlugins(options) {
  if (usesTailwindV4EntryPoint(String(options.cssContent || ""))) {
    return buildV4Plugins(options);
  }

  return buildV3Plugins(options);
}

module.exports = {
  buildPostcssPlugins,
  usesTailwindV4EntryPoint,
};
