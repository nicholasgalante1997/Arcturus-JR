import path from "path";
import postcss, { Processor } from "postcss";

import {
  type BunPostCSSBundlerOptions,
  type BunPostCSSBundlerResult,
  type PostcssTransform,
  PostcssPlugin,
} from "./types";
import { createPostCSSResult, getGlob, getOutfileAbsolutePath } from "./utils";

export function validateInputRegexGlob(glob: string) {
  return glob.endsWith(".css");
}

export async function getPostcssProcessor(
  plugins: PostcssPlugin[] = []
): Promise<postcss.Processor> {
  const pluginPromises = plugins.map((plugin) =>
    import(plugin).then((pluginModule) => {
      if ("default" in pluginModule) {
        return pluginModule.default;
      }
      return null;
    })
  );
  const pluginModules = await Promise.all(pluginPromises);
  return postcss(pluginModules.filter(Boolean));
}

export function getDefaultBunPostcssBundlerOptions(
  overrides: Partial<BunPostCSSBundlerOptions> = {}
): BunPostCSSBundlerOptions {
  return {
    input: new Bun.Glob("src/**/*.css"),
    plugins: [
      PostcssPlugin.autoprefixer,
      PostcssPlugin.cssnano,
      PostcssPlugin.tailwind,
    ],
    ...overrides,
  };
}

const handleRawPostcssTransform: PostcssTransform = async (
  processor: Processor,
  { outfile, input }: BunPostCSSBundlerOptions
) => {
  if (typeof input !== "string") {
    throw new Error("When using 'raw' option, 'input' must be a string.");
  }

  if (!outfile) {
    return processor.process(input, {
      from: '<inline>',
      to: '<inline>',
    });
  }

  if (outfile) {
    const out = getOutfileAbsolutePath(outfile);
    const result = await processor.process(input, {
      from: "<inline>",
      to: out,
    });

    await Bun.write(outfile, result.css, { createPath: true });

    return result;
  }

  throw new Error("Invalid state in handleRawPostcssTransform.");
};

const handleSingleOutputFileTransform: PostcssTransform = async (
  processor: Processor,
  { input, outfile }: BunPostCSSBundlerOptions
) => {
  const css: string[] = [];
  const glob = getGlob(input);
  const results: BunPostCSSBundlerResult[] = [];

  for await (const file of glob.scan(".")) {
    const content = await Bun.file(file).text();
    const transform = await processor.process(content, {
      from: file,
      to: file,
    });
    css.push(`/* ${file} */\n${transform.css}\n`);

    results.push(createPostCSSResult(processor, css, outfile!));
  }

  await Bun.write(getOutfileAbsolutePath(outfile!), css.join("\n"));

  return results;
};

const handleOutputDirectoryTransform: PostcssTransform = async (
  processor: Processor,
  { input, outdir, root }: BunPostCSSBundlerOptions
) => {
  const glob = getGlob(input);
  const results: BunPostCSSBundlerResult[] = [];

  for await (const file of glob.scan(".")) {
    const content = await Bun.file(file).text();
    let outfile = file.replace(path.resolve(process.cwd()), "");
    if (root) {
      outfile = outfile.replace(root, "");
    }

    if (outfile.startsWith(path.sep)) {
      outfile = outfile.slice(1);
    }

    const out = path.isAbsolute(outdir!)
      ? path.join(outdir!, outfile)
      : path.resolve(process.cwd(), outdir!, outfile);

    const transform = await processor.process(content, {
      from: file,
      to: out,
    });

    await Bun.write(out, transform.css, { createPath: true });

    results.push(transform);
  }

  return results;
};

const handleBundleTransform: PostcssTransform = async (
  processor,
  { input },
) => {
  const glob = getGlob(input);
  const css: string[] = [];
  
  for await (const file of glob.scan(".")) {
    const content = await Bun.file(file).text();
    const transform = await processor.process(content, {
      from: file,
      to: file,
    });
    css.push(`/* ${file} */\n${transform.css}\n`);
  }

  return createPostCSSResult(processor, css)
}

export async function xpostcss(options?: Partial<BunPostCSSBundlerOptions>) {
  const { input, outdir, outfile, plugins, raw, root, sourcemap, write } =
    getDefaultBunPostcssBundlerOptions(options);

  if (typeof input === "string" && !raw) {
    if (!validateInputRegexGlob(input)) {
      throw new Error(
        `Invalid input glob pattern: ${input}. Must end with .css`
      );
    }
  }

  const processor = await getPostcssProcessor(plugins);

  if (raw) {
    return handleRawPostcssTransform(processor, { input, outfile, sourcemap });
  }

  if (outfile) {
    return handleSingleOutputFileTransform(processor, { input, outfile });
  }

  if (outdir) {
    return handleOutputDirectoryTransform(processor, {
      input,
      outdir,
      root,
    });
  }

  return handleBundleTransform(
    processor,
    { input }
  );
}


export { postcss };
