export default function formatJson(value, pretty = false) {
  return JSON.stringify(
    value,
    (_, item) => (typeof item === "bigint" ? item.toString() : item),
    pretty ? 2 : 0,
  );
}
