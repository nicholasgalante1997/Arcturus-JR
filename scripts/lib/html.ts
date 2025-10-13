import path from 'path';

export async function getWebpackBundledHTML() {
  const webpackBundledHTMLPath = path.resolve(process.cwd(), 'dist', '_index.html');
  try {
    const html = Bun.file(webpackBundledHTMLPath, { type: 'text/html' });
    if (!(await html.exists())) {
      throw new Error(`${webpackBundledHTMLPath} does not exist`);
    }
    return html.text();
  } catch (e) {
    throw new Error(`Error reading bundled HTML file at ${webpackBundledHTMLPath}: ${e}`);
  }
}
