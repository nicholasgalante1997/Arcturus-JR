import { describe, test, expect, beforeEach } from "bun:test";
import path from "path";
import postcss from "postcss";
import {
  getOutfileAbsolutePath,
  getGlob,
  createPostCSSResult,
} from "../lib/utils";

describe("lib/utils.ts", () => {
  describe("getOutfileAbsolutePath", () => {
    test("returns absolute path when already absolute", () => {
      const absolutePath = "/home/user/project/dist/bundle.css";
      const result = getOutfileAbsolutePath(absolutePath);
      expect(result).toBe(absolutePath);
    });

    test("converts relative path to absolute using cwd", () => {
      const relativePath = "dist/bundle.css";
      const result = getOutfileAbsolutePath(relativePath);
      expect(path.isAbsolute(result)).toBe(true);
      expect(result).toBe(path.resolve(process.cwd(), relativePath));
    });

    test("handles single filename", () => {
      const filename = "bundle.css";
      const result = getOutfileAbsolutePath(filename);
      expect(path.isAbsolute(result)).toBe(true);
      expect(result).toBe(path.resolve(process.cwd(), filename));
    });

    test("handles nested relative paths", () => {
      const relativePath = "dist/css/styles/bundle.css";
      const result = getOutfileAbsolutePath(relativePath);
      expect(path.isAbsolute(result)).toBe(true);
      expect(result).toBe(path.resolve(process.cwd(), relativePath));
    });

    test("handles paths with ..", () => {
      const relativePath = "../dist/bundle.css";
      const result = getOutfileAbsolutePath(relativePath);
      expect(path.isAbsolute(result)).toBe(true);
      expect(result).toBe(path.resolve(process.cwd(), relativePath));
    });

    test("handles paths with .", () => {
      const relativePath = "./dist/bundle.css";
      const result = getOutfileAbsolutePath(relativePath);
      expect(path.isAbsolute(result)).toBe(true);
      expect(result).toBe(path.resolve(process.cwd(), relativePath));
    });
  });

  describe("getGlob", () => {
    test("returns same Bun.Glob when input is already a Glob", () => {
      const glob = new Bun.Glob("**/*.css");
      const result = getGlob(glob);
      expect(result).toBe(glob);
      expect(result).toBeInstanceOf(Bun.Glob);
    });

    test("creates new Bun.Glob when input is string", () => {
      const pattern = "src/**/*.css";
      const result = getGlob(pattern);
      expect(result).toBeInstanceOf(Bun.Glob);
    });

    test("handles simple patterns", () => {
      const pattern = "*.css";
      const result = getGlob(pattern);
      expect(result).toBeInstanceOf(Bun.Glob);
    });

    test("handles complex glob patterns", () => {
      const pattern = "src/{styles,css}/**/*.{css,scss}";
      const result = getGlob(pattern);
      expect(result).toBeInstanceOf(Bun.Glob);
    });

    test("handles absolute path patterns", () => {
      const pattern = "/home/user/project/**/*.css";
      const result = getGlob(pattern);
      expect(result).toBeInstanceOf(Bun.Glob);
    });
  });

  describe("createPostCSSResult", () => {
    let processor: postcss.Processor;

    beforeEach(() => {
      processor = postcss([]);
    });

    test("creates result with empty css array", () => {
      const css: string[] = [];
      const result = createPostCSSResult(processor, css);

      expect(result).toBeDefined();
      expect(result.css).toBe("");
      expect(result.content).toBe("");
      expect(result.processor).toBe(processor);
    });

    test("creates result with single css string", () => {
      const css = ["body { color: red; }"];
      const result = createPostCSSResult(processor, css);

      expect(result.css).toBe("body { color: red; }");
      expect(result.content).toBe("body { color: red; }");
      expect(result.toString()).toBe("body { color: red; }");
    });

    test("creates result with multiple css strings", () => {
      const css = [
        "body { color: red; }",
        "h1 { font-size: 2rem; }",
        ".container { max-width: 1200px; }",
      ];
      const result = createPostCSSResult(processor, css);

      const expected = css.join("\n");
      expect(result.css).toBe(expected);
      expect(result.content).toBe(expected);
      expect(result.toString()).toBe(expected);
    });

    test("sets outfile in opts when provided", () => {
      const css = ["body { color: red; }"];
      const outfile = "dist/bundle.css";
      const result = createPostCSSResult(processor, css, outfile);

      expect(result.opts.to).toBe(outfile);
    });

    test("sets default outfile when not provided", () => {
      const css = ["body { color: red; }"];
      const result = createPostCSSResult(processor, css);

      expect(result.opts.to).toBe("<inline>");
    });

    test("sets input in opts when provided", () => {
      const css = ["body { color: red; }"];
      const outfile = "dist/bundle.css";
      const input = "src/styles.css";
      const result = createPostCSSResult(processor, css, outfile, input);

      expect(result.opts.from).toBe(input);
    });

    test("sets default input when not provided", () => {
      const css = ["body { color: red; }"];
      const result = createPostCSSResult(processor, css);

      expect(result.opts.from).toBe("<inline>");
    });

    test("has warnings method that returns empty array", () => {
      const css = ["body { color: red; }"];
      const result = createPostCSSResult(processor, css);

      expect(result.warnings()).toEqual([]);
      expect(Array.isArray(result.warnings())).toBe(true);
    });

    test("has warn method that returns warning object", () => {
      const css = ["body { color: red; }"];
      const result = createPostCSSResult(processor, css);

      const warning = result.warn("test warning");
      expect(warning).toBeDefined();
    });

    test("has messages property", () => {
      const css = ["body { color: red; }"];
      const result = createPostCSSResult(processor, css);

      expect(result.messages).toEqual([]);
      expect(Array.isArray(result.messages)).toBe(true);
    });

    test("has processor property", () => {
      const css = ["body { color: red; }"];
      const result = createPostCSSResult(processor, css);

      expect(result.processor).toBe(processor);
    });

    test("handles css with newlines", () => {
      const css = ["body {\n  color: red;\n}", "h1 {\n  font-size: 2rem;\n}"];
      const result = createPostCSSResult(processor, css);

      expect(result.css).toBe(css.join("\n"));
      expect(result.content).toBe(css.join("\n"));
    });

    test("handles empty strings in css array", () => {
      const css = ["body { color: red; }", "", "h1 { font-size: 2rem; }"];
      const result = createPostCSSResult(processor, css);

      expect(result.css).toBe(css.join("\n"));
    });

    test("toString method returns joined css", () => {
      const css = ["body { color: red; }", "h1 { font-size: 2rem; }"];
      const result = createPostCSSResult(processor, css);

      expect(result.toString()).toBe(css.join("\n"));
      expect(typeof result.toString()).toBe("string");
    });
  });
});
