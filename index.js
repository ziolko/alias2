#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const binDirectory = execSync("npm bin -g", { stdio: ["ignore", "pipe", "pipe"] }).toString().replace(/\n$/, "");
const params = process.argv.slice(2).join(" ");
const separatorPos = params.indexOf("=");
const command = params.substring(0, separatorPos).trim();
const argument = params.substring(separatorPos + 1).trim();

if(!command) {
  console.log(`Usage: alias command = alias content
  
Easily create aliases on Windows.`);
  process.exit(0);
}

const content = `
  @echo off
  ${argument.trim()} %*
`;

const commandPath = path.join(binDirectory, `${command}.bat`);

if (!argument) {
  fs.unlinkSync(commandPath);
  console.log(`Removed alias for command ${command}`)
} else {
  console.log(`Created alias for command ${command}`)
  fs.writeFileSync(commandPath, content, { encoding: "UTF-8" });
}