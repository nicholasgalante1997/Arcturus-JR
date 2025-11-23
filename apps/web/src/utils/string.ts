export function coerceString(value: unknown) {
  switch (typeof value) {
    case 'string':
      return value;
    case 'number':
      return value.toString(10) + ' ';
    case 'bigint':
      return value.toString(10) + ' ';
    case 'object':
      return JSON.stringify(value);
    case 'boolean':
      return String(value);
    case 'symbol':
      return Symbol.keyFor(value) || '';
    case 'function':
    case 'undefined':
      return '';
  }
}
