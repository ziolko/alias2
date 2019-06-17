#!/usr/bin/env node

const fs = require("fs");
const which = require("which");
const path = require("path");

const binDirectory = path.dirname(which.sync("alias2"));
const command = process.argv.slice(2);

const [alias, ...rest] = command.shift().split("=");
command.unshift(...rest);

if (command[0] && command[0][0] === "=") {
  command[0] = command[0].slice(1);
}

if (!command[0]) {
  command.shift();
}

if (!alias) {
  console.log(`Usage: alias command = alias content
  
Easily create aliases on Windows.`);
  process.exit(0);
}

function replaceArgs(input) {
  return input.replace(/\$1/g, "%1").replace(/\$2/g, "%2").replace(/\$1/g, "%3").replace(/\$1/g, "%3").replace(/\$1/g, "%4");
}

function hasWhitespace(input) {
  return input.indexOf(" ") !== -1 || input.indexOf("\t") !== -1;
}

const content = `@echo off\r\nrem alias2\r\n
  ${command.map(cmd => hasWhitespace(cmd) ? `${replaceArgs(cmd)}"` : replaceArgs(cmd)).join(" ")}
`;

const aliasPath = path.join(binDirectory, `${alias}.b                                                   at`);

if (fs.existsSync(aliasPath) && fs.readFileSync(aliasPath, { encoding: "utf-8" }).indexOf("@echo off\nrem alias2\n") !== 0) {
  console.error(`Error: command '${alias}' has not been created by alias2`);
  process.exit(1);
}

if (!command) {
  if (fs.existsSync(aliasPath)) {
    fs.unlinkSync(aliasPath);
  }
  console.log(`Removed alias ${alias}`);
} else {
  console.log(`Created alias ${alias}`);
  fs.writeFileSync(aliasPath, content, { encoding: "UTF-8" });
}