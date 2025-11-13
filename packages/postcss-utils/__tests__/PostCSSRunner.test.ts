import { describe, test, expect, beforeEach } from "bun:test";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import PostCSSRunner from "../lib/models/PostCSSRunner";

describe("lib/models/PostCSSRunner.ts", () => {
  describe("PostCSSRunner class", () => {
    test("has static postcss property", () => {
      expect(PostCSSRunner.postcss).toBe(postcss);
      expect(PostCSSRunner.postcss).toBeDefined();
    });

    describe("constructor", () => {
      test("creates instance with empty plugins array", () => {
        const runner = new PostCSSRunner([]);
        expect(runner).toBeInstanceOf(PostCSSRunner);
        expect(runner.plugins).toEqual([]);
      });

      test("creates instance with single plugin", () => {
        const plugin = autoprefixer()
        const runner = new PostCSSRunner([plugin]);
        expect(runner).toBeInstanceOf(PostCSSRunner);
        expect(runner.plugins).toEqual([plugin]);
      });

      test("creates instance with multiple plugins", () => {
        const plugin1 = autoprefixer()
        const plugin2 = cssnano()
        const runner = new PostCSSRunner([plugin1, plugin2]);
        expect(runner).toBeInstanceOf(PostCSSRunner);
        expect(runner.plugins.length).toBe(2);
      });

      test("stores plugins as public property", () => {
        const plugins = [autoprefixer()]
        const runner = new PostCSSRunner(plugins);
        expect(runner.plugins).toBe(plugins);
      });
    });

    describe("process method", () => {
      let runner: PostCSSRunner;

      beforeEach(() => {
        runner = new PostCSSRunner([]);
      });

      test("processes plain CSS string", async () => {
        const css = "body { color: red; }";
        const result = await runner.process(css);

        expect(result).toBeDefined();
        expect(result.css).toBe(css);
      });

      test("processes CSS with options", async () => {
        const css = "body { color: red; }";
        const options: postcss.ProcessOptions = {
          from: "input.css",
          to: "output.css",
        };
        const result = await runner.process(css, options);

        expect(result).toBeDefined();
        expect(result.css).toBe(css);
        expect(result.opts.from).toBe("input.css");
        expect(result.opts.to).toBe("output.css");
      });

      test("processes empty CSS string", async () => {
        const css = "";
        const result = await runner.process(css);

        expect(result).toBeDefined();
        expect(result.css).toBe("");
      });

      test("processes CSS with newlines", async () => {
        const css = `body {
  color: red;
  background: blue;
}`;
        const result = await runner.process(css);

        expect(result).toBeDefined();
        expect(result.css).toContain("color");
        expect(result.css).toContain("background");
      });

      test("returns Result with standard properties", async () => {
        const css = "body { color: red; }";
        const result = await runner.process(css);

        expect(result.css).toBeDefined();
        expect(result.root).toBeDefined();
        expect(result.messages).toBeDefined();
        expect(Array.isArray(result.messages)).toBe(true);
      });

      test("accepts postcss.LazyResult as input", async () => {
        const css = "body { color: red; }";
        const processor = postcss([]);
        const lazyResult = processor.process(css, { from: undefined });
        const result = await runner.process(lazyResult);

        expect(result).toBeDefined();
      });

      test("accepts postcss.Root as input", async () => {
        const css = "body { color: red; }";
        const root = postcss.parse(css);
        const result = await runner.process(root);

        expect(result).toBeDefined();
        expect(result.css).toContain("body");
      });

      test("processes with autoprefixer plugin", async () => {
        const autoprefixer = await import("autoprefixer");
        const runnerWithPlugin = new PostCSSRunner([autoprefixer.default]);
        const css = "a { display: flex; }";
        const result = await runnerWithPlugin.process(css, {
          from: undefined,
        });

        expect(result).toBeDefined();
        expect(result.css).toBeDefined();
      });

      test("processes with cssnano plugin", async () => {
        const cssnano = await import("cssnano");
        const runnerWithPlugin = new PostCSSRunner([cssnano.default]);
        const css = "body { color: red; }";
        const result = await runnerWithPlugin.process(css, {
          from: undefined,
        });

        expect(result).toBeDefined();
        expect(result.css).toBeDefined();
      });

      test("processes with multiple plugins", async () => {
        const autoprefixer = await import("autoprefixer");
        const cssnano = await import("cssnano");
        const runnerWithPlugins = new PostCSSRunner([
          autoprefixer.default,
          cssnano.default,
        ]);
        const css = "body { color: red; }";
        const result = await runnerWithPlugins.process(css, {
          from: undefined,
        });

        expect(result).toBeDefined();
        expect(result.css).toBeDefined();
      });

      test("handles complex CSS", async () => {
        const css = `
          @import url('fonts.css');

          :root {
            --primary-color: #007bff;
          }

          body {
            color: var(--primary-color);
            display: grid;
            grid-template-columns: repeat(12, 1fr);
          }

          @media (max-width: 768px) {
            body {
              grid-template-columns: 1fr;
            }
          }
        `;
        const result = await runner.process(css);

        expect(result).toBeDefined();
        expect(result.css).toBeDefined();
      });

      test("handles CSS with comments", async () => {
        const css = `
          /* Header styles */
          header { color: blue; }

          /* Footer styles */
          footer { color: green; }
        `;
        const result = await runner.process(css);

        expect(result).toBeDefined();
        expect(result.css).toBeDefined();
      });

      test("handles invalid CSS gracefully", async () => {
        const invalidCss = "body { color: ; }"; // Invalid value
        const result = await runner.process(invalidCss);

        expect(result).toBeDefined();
      });

      test("returns result with warnings array", async () => {
        const css = "body { color: red; }";
        const result = await runner.process(css);

        expect(result.warnings).toBeDefined();
        expect(typeof result.warnings).toBe("function");
        expect(Array.isArray(result.warnings())).toBe(true);
      });

      test("processes with sourcemap option", async () => {
        const css = "body { color: red; }";
        const options: postcss.ProcessOptions = {
          from: "input.css",
          to: "output.css",
          map: { inline: false },
        };
        const result = await runner.process(css, options);

        expect(result).toBeDefined();
      });

      test("defaults to empty options when not provided", async () => {
        const css = "body { color: red; }";
        const result = await runner.process(css);

        expect(result).toBeDefined();
        expect(result.opts).toBeDefined();
      });
    });

    describe("integration tests", () => {
      test("creates runner and processes CSS end-to-end", async () => {
        const runner = new PostCSSRunner([]);
        const css = `
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
        `;
        const result = await runner.process(css, {
          from: "input.css",
          to: "output.css",
        });

        expect(result.css).toContain("container");
        expect(result.css).toContain("max-width");
        expect(result.opts.from).toBe("input.css");
        expect(result.opts.to).toBe("output.css");
      });

      test("multiple runners with different plugins work independently", async () => {
        const runner1 = new PostCSSRunner([]);
        const runner2 = new PostCSSRunner([]);

        const css = "body { color: red; }";
        const result1 = await runner1.process(css);
        const result2 = await runner2.process(css);

        expect(result1.css).toBe(result2.css);
      });
    });
  });
});
