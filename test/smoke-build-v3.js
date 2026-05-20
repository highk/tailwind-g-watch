const assert = require("assert");
const { mkdtemp, mkdir, readFile, writeFile } = require("fs/promises");
const os = require("os");
const path = require("path");
const build = require("../src/build");

async function main() {
  const root = await mkdtemp(path.join(os.tmpdir(), "tailwind-g-watch-"));
  const cssDir = path.join(root, "assets", "css");
  const configPath = path.join(cssDir, "config.css");
  const outputPath = path.join(cssDir, "index.dist.css");

  await mkdir(cssDir, { recursive: true });
  await writeFile(path.join(root, "index.html"), '<div class="text-red-500 font-bold">Hello</div>');
  await writeFile(configPath, "@tailwind utilities;\n");

  await build(configPath, {}, false, { output: "index.dist.css" });

  const css = await readFile(outputPath, "utf8");
  assert(css.includes(".font-bold"), "expected font-bold utility in generated CSS");
  assert(css.includes(".text-red-500"), "expected text-red-500 utility in generated CSS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
