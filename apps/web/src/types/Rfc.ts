import { type Rfc,rfcRecordSchema } from '@arcjr/content';

export type { Rfc };

export interface RfcWithContent extends Rfc {
  content: string;
}

// See Post.ts for why this validates against a passthrough variant: RfcWithContent
// legitimately carries a `content` field beyond Rfc's strict-by-design shape.
const rfcShapeSchema = rfcRecordSchema.passthrough();

export const isRfc = (obj: unknown): obj is Rfc => rfcShapeSchema.safeParse(obj).success;

export function isRfcWithContent(obj: unknown): obj is RfcWithContent {
  if (!isRfc(obj)) return false;
  const rfc = obj as RfcWithContent;
  return typeof rfc.content === 'string';
}
