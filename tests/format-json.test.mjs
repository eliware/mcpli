import { describe, test, expect } from "@jest/globals";
import formatJson from "../src/format-json.mjs";

describe("formatJson", () => {
  test("formats JSON and bigint values", () => {
    expect(formatJson({ id: 2n })).toBe('{"id":"2"}');
    expect(formatJson({ id: 2n }, true)).toBe('{\n  "id": "2"\n}');
  });
});
