const postcss = require("postcss");
const { dirname } = require("path");
const { mkdir, writeFile, readFile } = require("fs/promises");
const postcssScssSyntax = require("postcss-scss");
const { buildPostcssPlugins } = require("./tailwind-adapter");
const { preventDuplicateExecutionAsync } = require("./utils");

async function run(configPath, tailwindConfig, argv) {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    const postcssContent = await readFile(configPath);
    const postcssPlugins = buildPostcssPlugins({
      configPath,
      cssContent: postcssContent,
      tailwindConfig,
      isProduction,
    });

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
