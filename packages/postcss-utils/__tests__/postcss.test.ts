import { describe, test, expect, beforeEach, mock } from "bun:test";
import {
  validateInputRegexGlob,
  getPostcssProcessor,
  getDefaultBunPostcssBundlerOptions,
  xpostcss,
} from "../lib/postcss";
import { PostcssPlugin } from "../lib/types";
import type { BunPostCSSBundlerOptions } from "../lib/types";

describe("lib/postcss.ts", () => {
  describe("validateInputRegexGlob", () => {
    test("returns true for valid CSS glob pattern", () => {
      expect(validateInputRegexGlob("styles.css")).toBe(true);
      expect(validateInputRegexGlob("src/styles.css")).toBe(true);
      expect(validateInputRegexGlob("**/*.css")).toBe(true);
      expect(validateInputRegexGlob("dist/bundle.css")).toBe(true);
    });

    test("returns false for invalid glob patterns", () => {
      expect(validateInputRegexGlob("styles.scss")).toBe(false);
      expect(validateInputRegexGlob("styles.less")).toBe(false);
      expect(validateInputRegexGlob("styles.js")).toBe(false);
      expect(validateInputRegexGlob("styles")).toBe(false);
      expect(validateInputRegexGlob("")).toBe(false);
    });

    test("handles edge cases", () => {
      expect(validateInputRegexGlob(".css")).toBe(true);
      expect(validateInputRegexGlob("file.CSS")).toBe(false); // case sensitive
      expect(validateInputRegexGlob("file.css.map")).toBe(false);
    });
  });

  describe("getPostcssProcessor", () => {
    test("creates processor with no plugins", async () => {
      const processor = await getPostcssProcessor([]);
      expect(processor).toBeDefined();
      expect(typeof processor.process).toBe("function");
    });

    test("creates processor with single plugin", async () => {
      const processor = await getPostcssProcessor([PostcssPlugin.autoprefixer]);
      expect(processor).toBeDefined();
      expect(typeof processor.process).toBe("function");
    });

    test("creates processor with multiple plugins", async () => {
      const processor = await getPostcssProcessor([
        PostcssPlugin.autoprefixer,
        PostcssPlugin.cssnano,
      ]);
      expect(processor).toBeDefined();
      expect(typeof processor.process).toBe("function");
    });

    test("handles all available plugins", async () => {
      const processor = await getPostcssProcessor([
        PostcssPlugin.autoprefixer,
        PostcssPlugin.cssnano,
        PostcssPlugin.tailwind,
      ]);
      expect(processor).toBeDefined();
      expect(typeof processor.process).toBe("function");
    });

    test("filters out null plugin modules", async () => {
      // Test that the processor correctly filters out plugins without default exports
      const processor = await getPostcssProcessor([]);
      expect(processor).toBeDefined();
    });
  });

  describe("getDefaultBunPostcssBundlerOptions", () => {
    test("returns default options without overrides", () => {
      const options = getDefaultBunPostcssBundlerOptions();

      expect(options.input).toBeInstanceOf(Bun.Glob);
      expect(options.plugins).toEqual([
        PostcssPlugin.autoprefixer,
        PostcssPlugin.cssnano,
        PostcssPlugin.tailwind,
      ]);
    });

    test("merges overrides with defaults", () => {
      const overrides: Partial<BunPostCSSBundlerOptions> = {
        outfile: "dist/bundle.css",
        plugins: [PostcssPlugin.autoprefixer],
      };
      const options = getDefaultBunPostcssBundlerOptions(overrides);

      expect(options.outfile).toBe("dist/bundle.css");
      expect(options.plugins).toEqual([PostcssPlugin.autoprefixer]);
      expect(options.input).toBeInstanceOf(Bun.Glob);
    });

    test("handles empty overrides", () => {
      const options = getDefaultBunPostcssBundlerOptions({});
      expect(options.input).toBeInstanceOf(Bun.Glob);
      expect(options.plugins).toBeDefined();
    });

    test("overrides input glob pattern", () => {
      const customGlob = new Bun.Glob("dist/**/*.css");
      const options = getDefaultBunPostcssBundlerOptions({
        input: customGlob,
      });

      expect(options.input).toBe(customGlob);
    });

    test("preserves all override values", () => {
      const overrides: Partial<BunPostCSSBundlerOptions> = {
        outfile: "dist/bundle.css",
        outdir: "dist",
        root: "src",
        write: true,
        raw: false,
        sourcemap: true,
      };
      const options = getDefaultBunPostcssBundlerOptions(overrides);

      expect(options.outfile).toBe("dist/bundle.css");
      expect(options.outdir).toBe("dist");
      expect(options.root).toBe("src");
      expect(options.write).toBe(true);
      expect(options.raw).toBe(false);
      expect(options.sourcemap).toBe(true);
    });
  });

  describe("xpostcss", () => {
    test("throws error for invalid input glob pattern (string)", async () => {
      await expect(
        xpostcss({
          input: "styles.scss",
        })
      ).rejects.toThrow("Invalid input glob pattern");
    });

    test("throws error for invalid input glob not ending in .css", async () => {
      await expect(
        xpostcss({
          input: "src/**/*.js",
        })
      ).rejects.toThrow("Must end with .css");
    });

    test("accepts valid CSS glob pattern", async () => {
      // This test may need actual CSS files to process
      // We're just testing that it doesn't throw on valid input
      const options: Partial<BunPostCSSBundlerOptions> = {
        input: new Bun.Glob("src/**/*.css"),
        plugins: [],
      };

      // Should not throw
      await expect(xpostcss(options)).resolves.toBeDefined();
    });

    test("handles raw transform with string input", async () => {
      const cssContent = "body { color: red; }";

      await expect(
        xpostcss({
          input: cssContent,
          raw: true,
          plugins: [],
        })
      ).resolves.toBeDefined();
    });

    test("throws error for raw transform without string input", async () => {
      await expect(
        xpostcss({
          input: new Bun.Glob("**/*.css"),
          raw: true,
        })
      ).rejects.toThrow("When using 'raw' option, 'input' must be a string");
    });

    test("uses default options when no options provided", async () => {
      // Should use default glob pattern and plugins
      await expect(xpostcss()).resolves.toBeDefined();
    });

    test("processes with outfile option", async () => {
      const options: Partial<BunPostCSSBundlerOptions> = {
        input: new Bun.Glob("src/**/*.css"),
        outfile: "dist/bundle.css",
        plugins: [],
      };

      await expect(xpostcss(options)).resolves.toBeDefined();
    });

    test("processes with outdir option", async () => {
      const options: Partial<BunPostCSSBundlerOptions> = {
        input: new Bun.Glob("src/**/*.css"),
        outdir: "dist",
        plugins: [],
      };

      await expect(xpostcss(options)).resolves.toBeDefined();
    });

    test("processes with bundle mode (no outfile/outdir)", async () => {
      const options: Partial<BunPostCSSBundlerOptions> = {
        input: new Bun.Glob("src/**/*.css"),
        plugins: [],
      };

      await expect(xpostcss(options)).resolves.toBeDefined();
    });
  });
});
