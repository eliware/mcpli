export default function parseJson(value = "{}") {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Invalid JSON arguments: ${error.message}`);
  }
}
