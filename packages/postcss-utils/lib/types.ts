import type { SourceMapOptions, Result, Root, Processor } from "postcss";

export interface PostcssTransform {
  (processor: Processor, options: BunPostCSSBundlerOptions): Promise<BunPostCSSBundlerResult | BunPostCSSBundlerResult[]>
}

export enum PostcssPlugin {
  autoprefixer = "autoprefixer",
  cssnano = "cssnano",
  tailwind = "tailwindcss",
}

export interface BunPostCSSBundlerOptions {
  input: Bun.Glob | string;
  plugins?: PostcssPlugin[];
  outfile?: string;
  outdir?: string;
  root?: string;
  write?: boolean;
  raw?: boolean;
  sourcemap?: boolean | SourceMapOptions;
}

export interface BunPostCSSBundlerResult extends Result<Root> {}