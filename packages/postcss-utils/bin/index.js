#! /usr/bin/env bun

import { $ } from "bun";
import fs from "fs";
import { Command } from "commander";
import path from "path";
import picocolors from "picocolors";
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
      const configs = [
        "postcss.config.js",
        "postcss.config.cjs",
        "postcss.config.mjs",
      ];
      const foundConfigs = configs.filter((config) => {
        return fs.existsSync(path.resolve(process.cwd(), config));
      });
      foundConfigs.forEach((config) => {
        console.log(`Found config: ${picocolors.green(config)}`);
      });
      const postcssConfigs = foundConfigs.map(async (config) => {
        const mod = await import(config);
        return { file: config, config: mod.default || mod };
      });
      console.log(inspect(postcssConfigs, { depth: null, colors: true }));
    } catch (error) {
      console.error("Error loading PostCSS configuration:", error);
    }
  });

command
  .command("run-cli [args...]")
  .description("Run PostCSS CLI with provided arguments")
  .argument("<input>", "Input (file|directory) for PostCSS CLI")
  .option("--ext <ext>", "File extension for PostCSS CLI")
  .option("--base <base>", "Base directory for PostCSS CLI")
  .option("-o, --output <output>", "Output file for PostCSS CLI")
  .option("-d, --dir <dir>", "Output directory for PostCSS CLI")
  .option("--verbose", "Enable verbose logging")
  .action(async (input, options) => {
    const hasPostCSSCLI = await hasPostCSSCLIDependency();
    if (!hasPostCSSCLI) {
      console.error(
        "postcss-cli is not installed. Please install it to use this command."
      );
      process.exit(1);
    }

    const flags = [];
    if (options.dir && options.ext) {
      flags.push(`--ext ${options.ext}`);
    }
    if (options.dir && options.base) {
      flags.push(`--base ${options.base}`);
    }
    if (options.output) {
      flags.push(`-o ${options.output}`);
    }
    if (options.dir) {
      flags.push(`-d ${options.dir}`);
    }
    if (options.verbose) {
      flags.push(`--verbose`);
    }

    const sh = await $`bunx postcss ${input} ${flags.join(" ")}`
      .nothrow()
      .quiet();

    if (sh.exitCode !== 0) {
      console.error("PostCSS CLI execution failed:");
      console.error(sh.stderr.toString("utf-8"));
      process.exit(sh.exitCode);
    }

    console.log(picocolors.bold(picocolors.blue(sh.stdout.toString("utf-8"))));
  });

command.parse();

async function hasPostCSSCLIDependency() {
  try {
    await import("postcss");
    await import("postcss-cli");
    return true;
  } catch (error) {
    return false;
  }
}
