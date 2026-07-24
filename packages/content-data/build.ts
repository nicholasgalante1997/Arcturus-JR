import { loadPosts, loadRfcs, buildPostManifest, buildRfcManifest } from '@arcjr/content';

const SRC_DIR = import.meta.dir;
const DIST_DIR = `${SRC_DIR}/dist`;

export {};

try {
  console.log('Starting build for @arcjr/content-data...');
  const start = performance.now();

  await Bun.$`rm -rf ${DIST_DIR}`;
  await Bun.$`mkdir -p ${DIST_DIR}/posts ${DIST_DIR}/rfcs`;

  // loadPosts/loadRfcs fail loud (file path + Zod error) on the first invalid
  // file — this is what turns a bad frontmatter edit into a build failure
  // instead of a 404 or a hung prerender (G3, R4).
  const posts = await loadPosts(`${SRC_DIR}/posts`);
  const rfcs = await loadRfcs(`${SRC_DIR}/rfcs`);

  // dist bodies are frontmatter-stripped. Posts: MarkdownService re-parses
  // frontmatter anyway, so this is just avoiding a pointless duplicate. RFCs:
  // RfcService serves the .txt file raw with no frontmatter stripping at all —
  // shipping frontmatter in dist would leak the raw YAML block into the
  // rendered <pre> output. Same rule for both, for one reason each.
  for (const post of posts) {
    await Bun.write(`${DIST_DIR}/posts/${post.id}.md`, post.body);
  }
  for (const rfc of rfcs) {
    await Bun.write(`${DIST_DIR}/rfcs/${rfc.id}.txt`, rfc.body);
  }

  await Bun.write(`${DIST_DIR}/posts.json`, buildPostManifest(posts.map((p) => p.record)));
  await Bun.write(`${DIST_DIR}/rfcs.json`, buildRfcManifest(rfcs.map((r) => r.record)));

  // Flat passthrough pages — not a collection, no schema, no manifest entry.
  await Bun.write(`${DIST_DIR}/about.md`, await Bun.file(`${SRC_DIR}/about.md`).text());
  await Bun.write(`${DIST_DIR}/home.md`, await Bun.file(`${SRC_DIR}/home.md`).text());

  console.log(
    `Build finished in ${(performance.now() - start).toFixed(2)}ms — ${posts.length} posts, ${rfcs.length} rfcs`
  );
} catch (e) {
  console.error('Build failed: ', e);
  await Bun.$`rm -rf ${DIST_DIR}`;
  process.exit(1);
}
