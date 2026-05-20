const yargs = require("yargs");

module.exports = function parseCliOptions(scriptName) {
  return yargs
    .scriptName(scriptName)
    .usage("Usage: $0 -c <tailwind.config.js path> -d <dir path> -m")
    .example("$0", "watch .")
    .example("$0 -d views", "watch ./views")
    .example("$0 -c nav.config.js -d nav", "use nav.config.js & watch ./nav")
    .option("m", {
      alias: "minify",
      describe: "Minify output css",
      demandOption: false,
      type: undefined,
      nargs: 0,
    })
    .option("c", {
      alias: "config",
      describe: "Base tailwind.config.js path",
      demandOption: false,
      type: "string",
      nargs: 1,
    })
    .option("d", {
      alias: "dir",
      describe: "Watch directory path",
      demandOption: false,
      type: "string",
      nargs: 1,
    })
    .option("i", {
      alias: "input",
      describe: "Change config file name",
      demandOption: false,
      default: "config",
      type: "string",
      nargs: 1,
    })
    .option("o", {
      alias: "output",
      describe: "Change output css file name",
      demandOption: false,
      default: "index.dist.css",
      type: "string",
      nargs: 1,
    })
    .help("h")
    .alias("h", "help")
    .version("v")
    .alias("v", "version")
    .epilog("copyright 2023")
    .argv;
};
