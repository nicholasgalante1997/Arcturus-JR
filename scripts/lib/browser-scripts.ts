import fs from 'fs';
import path from 'path';

export function getBrowserESMBundles(publicPath = '/'): string[] {
  const runtime = findBundleInDistOutput('runtime', publicPath);
  const vendors = findBundleInDistOutput('vendors', publicPath);
  const main = findBundleInDistOutput('main', publicPath);
  return [runtime, vendors, main];
}

function findBundleInDistOutput(name: string, publicPath = '/') {
  const dist = path.resolve(process.cwd(), 'dist');
  const distdes = fs.readdirSync(dist, { encoding: 'utf8', withFileTypes: true });
  const de = distdes
    .filter((de) => de.isFile() && de.name.endsWith('.js'))
    .find((de) => de.name.startsWith(name));
  if (!de) throw new Error('Missing file ' + name);

  return `${publicPath}${de.name}`;
}
