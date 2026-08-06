export function formatJson(value, pretty = false) {
  return JSON.stringify(value, (_, item) => typeof item === 'bigint' ? item.toString() : item, pretty ? 2 : 0);
}

export function printValue(value, options, log = console.log, label = '') {
  if (options.json) return log(formatJson(value, options.pretty));
  if (typeof value === 'string') return log(value);
  if (label) log(`${label}:`);
  return log(formatJson(value, true));
}

export function parseJson(value = '{}') {
  try { return JSON.parse(value); } catch (error) { throw new Error(`Invalid JSON arguments: ${error.message}`); }
}
