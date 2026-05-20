const assert = require("assert");
const { mkdtemp, mkdir, readFile, symlink, writeFile } = require("fs/promises");
const os = require("os");
const path = require("path");
const build = require("../src/build");

async function main() {
  if (Number(process.versions.node.split(".")[0]) < 20) {
    console.log("Skipping Tailwind CSS v4 smoke test on Node.js < 20.");
    return;
  }

  const root = await mkdtemp(path.join(os.tmpdir(), "tailwind-g-watch-v4-"));
  const cssDir = path.join(root, "assets", "css");
  const modulesDir = path.join(root, "node_modules");
  const configPath = path.join(cssDir, "config.css");
  const outputPath = path.join(cssDir, "index.dist.css");
  const tailwindV4Path = path.join(
    __dirname,
    "..",
    "node_modules",
    "@tailwindcss",
    "postcss",
    "node_modules",
    "tailwindcss"
  );

  await mkdir(cssDir, { recursive: true });
  await mkdir(modulesDir, { recursive: true });
  await symlink(tailwindV4Path, path.join(modulesDir, "tailwindcss"), "dir");
  await writeFile(path.join(root, "index.html"), '<div class="text-red-500 font-bold">Hello</div>');
  await writeFile(configPath, '@import "tailwindcss";\n');

  await build(configPath, {}, false, { output: "index.dist.css" });

  const css = await readFile(outputPath, "utf8");
  assert(css.includes(".font-bold"), "expected font-bold utility in generated CSS");
  assert(css.includes(".text-red-500"), "expected text-red-500 utility in generated CSS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
