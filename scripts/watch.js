const fs = require("fs");
const watch = require("../src/watch");

if (fs.existsSync(`${process.cwd()}/tailwind.config.js`)) {
  const config = require(`${process.cwd()}/tailwind.config.js`);
  watch(config);
} else {
  console.log(`${process.cwd()}/tailwind.config.js is not exist.`);
}
