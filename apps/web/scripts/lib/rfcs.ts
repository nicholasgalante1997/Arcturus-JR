import _rfcs from '@public/content/rfcs.json';

export const rfcs = _rfcs.filter(({ visible }) => visible);

export const rfc_slugs = rfcs.map((rfc) => rfc.id);
