import { CONTENT_DATA_DIR } from './paths';

export interface RebuildResult {
  ok: boolean;
  output: string;
}

// Shells out to @arcjr/content-data's own build task rather than
// reimplementing manifest regeneration in-process — this guarantees the
// editor and the real build run the literal same validation/generation code
// path, so they can't quietly drift apart over time. Re-validates the whole
// collection on every save; at this content scale that's single-digit
// milliseconds, not worth optimizing away.
export async function rebuildContentData(): Promise<RebuildResult> {
  const proc = Bun.spawn(['bun', 'run', 'build.ts'], {
    cwd: CONTENT_DATA_DIR,
    stdout: 'pipe',
    stderr: 'pipe'
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited
  ]);

  return { ok: exitCode === 0, output: `${stdout}${stderr}` };
}
