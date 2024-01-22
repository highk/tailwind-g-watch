#!/usr/bin/env node

const yargs = require("yargs");
const fs = require("fs");
const watch = require("../src/watch");

const { argv } = yargs
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
    type: 'string',
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
    default: 'config',
    type: "string",
    nargs: 1,
  })
  .option("o", {
    alias: "output",
    describe: "Change output css file name",
    demandOption: false,
    default: 'index.dist.css',
    type: "string",
    nargs: 1,
  })
  .help("h")
  .alias("h", "help")
  .version("v")
  .alias("v", "version")
  .epilog("copyright 2023");
  

let configPath = `${process.cwd()}/tailwind.config.js`;
if(argv.config) {

  if(argv.config[0] === '.') {
    if(argv.config[1] === '/') {
      configPath = `${process.cwd()}/${argv.config.slice(2)}`;
    }
    else {
      configPath = `${process.cwd()}/${argv.config}`;
    }
  }
  else if(argv.config[0] !== '/') {
    configPath = `${process.cwd()}/${argv.config}`;
  }
  else {
    configPath = argv.config;
  }
}

console.log('Default Config :', configPath);
console.log('Show help : tailwind-g-watch -h');

if(!fs.existsSync(configPath)) {
  console.log(`Not found config : ${configPath}`)
}

watch(fs.existsSync(configPath) ? require(configPath) : {}, argv);