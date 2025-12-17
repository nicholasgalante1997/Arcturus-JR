#! /usr/bin/env bun

import { $ } from "bun";
import { Command } from "commander";
import path from "path";
import { inspect } from "util";

const command = new Command();

command
  .name("x-postcss")
  .description("A collection of PostCSS utilities")
  .version("1.0.0");

command
  .command("ls-config")
  .description("List PostCSS configuration")
  .action(async () => {
    try {
      const configs = ["postcss.config.js"];
      const postcssConfig = await import(configs[0]).then(mod => mod.default || mod);
      console.log(inspect(postcssConfig, { depth: null, colors: true }));
    } catch (error) {
      console.error("Error loading PostCSS configuration:", error);
    }
  });

command
  .command("run-cli [args...]")
  .description("Run PostCSS CLI with provided arguments")
  .action(async (args) => {
    const hasPostCSSCLI = await hasPostCSSCLIDependency();
    if (!hasPostCSSCLI) {
      console.error("postcss-cli is not installed. Please install it to use this command.");
      process.exit(1);
    }
  });

command.parse();

async function hasPostCSSCLIDependency() {
  try {
    await import("postcss-cli");
    return true;
  } catch (error) {
    return false;
  }
}