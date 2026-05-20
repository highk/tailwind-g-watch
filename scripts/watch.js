const fs = require("fs");
const watch = require("../src/watch");
const parseCliOptions = require("../src/cli-options");

const argv = parseCliOptions("tailwind-g-watch");
  

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

console.log('Default Config:', configPath);
console.log('Show help : tailwind-g-watch -h');

if(!fs.existsSync(configPath)) {
  console.log(`Not found config : ${configPath}`)
}

watch(fs.existsSync(configPath) ? require(configPath) : {}, argv);
