import formatJson from "./format-json.mjs";

export default function printValue(value, options, log = console.log, label = "") {
  if (options.json) return log(formatJson(value, options.pretty));
  if (typeof value === "string") return log(value);
  if (label) log(`${label}:`);
  return log(formatJson(value, true));
}
