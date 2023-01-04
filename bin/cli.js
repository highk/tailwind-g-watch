#!/usr/bin/env node
const fs = require("fs");
const watch = require("../src/watch");

if (fs.existsSync(`${process.cwd()}/taliwind.config.js`)) {
  const config = require(`${process.cwd()}/taliwind.config.js`);
  watch(config);
} else {
  console.log(`${process.cwd()}/taliwind.config.js is not exist.`);
}
