import { unlink } from 'fs/promises';

import {
  loadRfcs,
  parseFrontmatter,
  rfcFrontmatterSchema,
  RFC_FRONTMATTER_KEY_ORDER,
  serializeFrontmatter,
  type RfcFrontmatter
} from '@arcjr/content';

import { isValidId, RFCS_DIR } from '../paths';
import { rebuildContentData } from '../rebuildContentData';

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

function rfcFilePath(id: string): string {
  return `${RFCS_DIR}/${id}.txt`;
}

export async function listRfcs(): Promise<Response> {
  const entries = await loadRfcs(RFCS_DIR);
  return json(entries.map((e) => e.record));
}

export async function getRfc(req: Bun.BunRequest): Promise<Response> {
  const { id } = req.params;
  if (!isValidId(id)) return json({ error: 'Invalid id' }, 400);

  const file = Bun.file(rfcFilePath(id));
  if (!(await file.exists())) return json({ error: 'RFC not found' }, 404);

  const text = await file.text();
  const { attributes, body } = parseFrontmatter(text);
  const result = rfcFrontmatterSchema.safeParse(attributes);
  if (!result.success) {
    return json({ error: 'RFC frontmatter is invalid', details: result.error.issues }, 422);
  }

  return json({ id, frontmatter: result.data, body });
}

interface RfcSavePayload {
  frontmatter: RfcFrontmatter;
  body: string;
}

type SaveResult = { ok: true; payload: RfcSavePayload } | { ok: false; response: Response };

function parseSavePayload(raw: unknown): SaveResult {
  const { frontmatter, body } = (raw ?? {}) as { frontmatter?: unknown; body?: unknown };
  const result = rfcFrontmatterSchema.safeParse(frontmatter);
  if (!result.success) {
    return {
      ok: false,
      response: json({ error: 'Frontmatter failed validation', details: result.error.issues }, 422)
    };
  }
  if (typeof body !== 'string') {
    return { ok: false, response: json({ error: '"body" must be a string' }, 400) };
  }

  return { ok: true, payload: { frontmatter: result.data, body } };
}

async function readJsonBody(req: Bun.BunRequest): Promise<{ ok: true; raw: unknown } | { ok: false; response: Response }> {
  try {
    return { ok: true, raw: await req.json() };
  } catch {
    return { ok: false, response: json({ error: 'Invalid JSON body' }, 400) };
  }
}

export async function createRfc(req: Bun.BunRequest): Promise<Response> {
  const parsedBody = await readJsonBody(req);
  if (!parsedBody.ok) return parsedBody.response;

  const { id } = (parsedBody.raw ?? {}) as { id?: unknown };
  if (typeof id !== 'string' || !isValidId(id)) {
    return json({ error: '"id" must be a valid, URL-safe filename stem' }, 400);
  }
  if (await Bun.file(rfcFilePath(id)).exists()) {
    return json({ error: `RFC "${id}" already exists` }, 409);
  }

  const parsed = parseSavePayload(parsedBody.raw);
  if (!parsed.ok) return parsed.response;

  const text = serializeFrontmatter(parsed.payload.frontmatter, parsed.payload.body, RFC_FRONTMATTER_KEY_ORDER);
  await Bun.write(rfcFilePath(id), text);

  const rebuild = await rebuildContentData();
  return json({ id, created: true, manifestRebuild: rebuild }, rebuild.ok ? 201 : 500);
}

export async function updateRfc(req: Bun.BunRequest): Promise<Response> {
  const { id } = req.params;
  if (!isValidId(id)) return json({ error: 'Invalid id' }, 400);
  if (!(await Bun.file(rfcFilePath(id)).exists())) {
    return json({ error: `RFC "${id}" not found` }, 404);
  }

  const parsedBody = await readJsonBody(req);
  if (!parsedBody.ok) return parsedBody.response;

  const parsed = parseSavePayload(parsedBody.raw);
  if (!parsed.ok) return parsed.response;

  const text = serializeFrontmatter(parsed.payload.frontmatter, parsed.payload.body, RFC_FRONTMATTER_KEY_ORDER);
  await Bun.write(rfcFilePath(id), text);

  const rebuild = await rebuildContentData();
  return json({ id, updated: true, manifestRebuild: rebuild }, rebuild.ok ? 200 : 500);
}

export async function deleteRfc(req: Bun.BunRequest): Promise<Response> {
  const { id } = req.params;
  if (!isValidId(id)) return json({ error: 'Invalid id' }, 400);

  if (!(await Bun.file(rfcFilePath(id)).exists())) return json({ error: `RFC "${id}" not found` }, 404);

  await unlink(rfcFilePath(id));

  const rebuild = await rebuildContentData();
  return json({ id, deleted: true, manifestRebuild: rebuild }, rebuild.ok ? 200 : 500);
}
