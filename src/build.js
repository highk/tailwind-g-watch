const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const { dirname } = require("path");
const { mkdir, writeFile, readFile } = require("fs/promises");
const productionPostcssPlugins = require("./postcss.plugins.production");
const defaultPostcssPlugins = require("./postcss.plugins");
const tailwindPlugins = require("./taliwind.plugins");
const postcssScssSyntax = require("postcss-scss");
const { preventDuplicateExecutionAsync } = require("./utils");

async function run(configPath, tailwindConfig, argv) {
  const isProdction = process.env.NODE_ENV === "production";
  const tailwindPostcssPlugin = tailwindcss({
    content: [
      `${dirname(dirname(dirname(configPath)))}/*.{html,blade.php,jsx,tsx,pug}`,
    ],
    ...tailwindPlugins,
    ...tailwindConfig,
  });

  try {
    const postcssContent = await readFile(configPath);
    const postcssPlugins = [...defaultPostcssPlugins, tailwindPostcssPlugin];

    if (isProdction) {
      postcssPlugins.push(...productionPostcssPlugins);
    }

    const cssContent = await postcss(postcssPlugins).process(postcssContent, {
      from: configPath,
      to: `${dirname(dirname(configPath))}/css/${argv.output}`,
      map: true,
      syntax: postcssScssSyntax,
    });
    await mkdir(`${dirname(dirname(configPath))}/css`, { recursive: true });
    await writeFile(
      `${dirname(dirname(configPath))}/css/${argv.output}`,
      cssContent.css
    );
  } catch (e) {
    console.log(`Error : ${e.message}`);
    console.log(
      `Fail : Make ${dirname(dirname(configPath))}/css/${argv.output}\n`
    );
  }
}

module.exports = preventDuplicateExecutionAsync(async function (
  configPath,
  tailwindConfig,
  isLog,
  argv
) {
  if (isLog !== false) console.log("Process : " + configPath);
  await run(configPath, tailwindConfig, argv);
});
