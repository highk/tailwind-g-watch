const assert = require("assert");
const { spawn } = require("child_process");
const { mkdtemp, mkdir, readFile, stat, symlink, writeFile } = require("fs/promises");
const os = require("os");
const path = require("path");

async function exists(filepath) {
  try {
    await stat(filepath);
    return true;
  } catch {
    return false;
  }
}

async function waitForFile(filepath, timeoutMs = 8000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await exists(filepath)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Timed out waiting for ${filepath}`);
}

async function main() {
  if (Number(process.versions.node.split(".")[0]) < 20) {
    console.log("Skipping Tailwind CSS v4 CLI smoke test on Node.js < 20.");
    return;
  }

  const root = await mkdtemp(path.join(os.tmpdir(), "tailwind-g-watch-cli-v4-"));
  const cssDir = path.join(root, "assets", "css");
  const modulesDir = path.join(root, "node_modules");
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
  await writeFile(path.join(root, "index.html"), '<div class="text-red-500 font-bold p-4">Hello</div>');
  await writeFile(path.join(cssDir, "config.css"), '@import "tailwindcss";\n');

  const child = spawn(process.execPath, [path.join(__dirname, "..", "bin", "cli.js"), "-d", "."], {
    cwd: root,
    stdio: "inherit",
  });

  try {
    await waitForFile(outputPath);
  } finally {
    child.kill("SIGTERM");
  }

  const css = await readFile(outputPath, "utf8");
  assert(css.includes(".font-bold"), "expected font-bold utility in generated CSS");
  assert(css.includes(".text-red-500"), "expected text-red-500 utility in generated CSS");
  assert(css.includes(".p-4"), "expected p-4 utility in generated CSS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
