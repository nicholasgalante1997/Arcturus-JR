import postcss, { Processor } from "postcss";
import { validateShellPath } from "../utils";

type Trait_ToString = {
  toString(): string;
};

type CSSContent<T extends Trait_ToString = { toString(): string }> =
  | T
  | postcss.LazyResult
  | postcss.Result
  | postcss.Root
  | string;

class PostCSSRunnerShellBuilder {
  private output: {
    file?: string;
    dir?: string;
    dir_FileExtension?: string;
    dir_BaseDir?: string;
  } = {};

  private input?: string;
  private verbose?: boolean;

  public setOutputDir(dir: string) {
    this.output.dir = dir;
    return this;
  }

  public setOutputFile(file: string) {
    this.output.file = file;
    return this;
  }

  public setInput(input: string) {
    this.input = input;
    return this;
  }

  public setOutputDirFileExtension(ext: string) {
    this.output.dir_FileExtension = ext;
    return this;
  }

  public setOutputDirBase(base: string) {
    this.output.dir_BaseDir = base;
    return this;
  }

  public setVerbose() {
    this.verbose = true;
    return this;
  }

  build() {
    if (!this.input) {
      throw new Error("Input <file|dir> is required");
    }

    if (!this.output.dir && !this.output.file) {
      throw new Error("Output <file|dir> is required");
    }

    const sanitizedInput = validateShellPath(this.input);
    const sanitizedOutput = validateShellPath(this.output.file || this.output.dir!);

    const run = () => Bun.$`postcss ${sanitizedInput} ${this.output.file ? `-o ${sanitizedOutput}` : `--dir ${sanitizedInput}`} ${(this.output.dir && this.output.dir_BaseDir) ? `--base ${this.output.dir_BaseDir}` : ""} ${(this.output.dir && this.output.dir_FileExtension) ? `--ext ${this.output.dir_FileExtension}` : ""} ${this.verbose ? "-v" : ""}`

    return run.bind(this);
  }
}

export default class PostCSSRunner {
  static postcss = postcss;

  static ShellBuilder = PostCSSRunnerShellBuilder;

  private processor: Processor;

  constructor(public plugins: postcss.AcceptedPlugin[]) {
    this.processor = postcss(plugins);
  }

  /**
   * @see https://github.com/postcss/postcss?tab=readme-ov-file#js-api
   */
  async process(css: CSSContent, options: postcss.ProcessOptions = {}) {
    return this.processor.process(css, options);
  }

  async sh(input: string, output: string) {
    // Validate paths to prevent command injection
    const validatedInput = validateShellPath(input);
    const validatedOutput = validateShellPath(output);

    const shresult =
      await Bun.$`postcss ${validatedInput} ${validatedOutput.endsWith(".css") ? `-o ${validatedOutput}` : `--dir ${validatedOutput}`}`;
    
    if (shresult.exitCode !== 0) {
      throw new Error(shresult.text())
    }
  }
}
