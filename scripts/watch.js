const yargs = require("yargs");
const fs = require("fs");
const watch = require("../src/watch");

var { argv } = yargs
  .usage("Usage: $0 -d <dir path> -m")
  .example("$0", "watch .")
  .example("$0 -d views", "watch ./views")
  .option("m", {
    alias: "minify",
    describe: "Minify output css",
    demandOption: false,
    type: undefined,
    nargs: 0,
  })
  .option("d", {
    alias: "dir",
    describe: "Watch directory path",
    demandOption: false,
    type: "string",
    nargs: 1,
  })
  .help("h")
  .alias("h", "help")
  .version("v")
  .alias("v", "version")
  .epilog("copyright 2023");

if (fs.existsSync(`${process.cwd()}/tailwind.config.js`)) {
  const config = require(`${process.cwd()}/tailwind.config.js`);
  watch(config, argv);
} else {
  console.log(`${process.cwd()}/tailwind.config.js is not exist.`);
}
