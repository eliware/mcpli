import { describe, test, expect } from "@jest/globals";
import parseJson from "../src/parse-json.mjs";

describe("parseJson", () => {
  test("parses JSON and uses an empty object by default", () => {
    expect(parseJson('{"x":1}')).toEqual({ x: 1 });
    expect(parseJson()).toEqual({});
  });

  test("rejects malformed JSON with the parser message", () => {
    expect(() => parseJson("{bad")).toThrow("Invalid JSON");
  });
});
