import { describe, test, expect } from "@jest/globals";
import { parseArgs } from "../src/args.mjs";

describe("args", () => {
  test("parses help aliases and output flags", () => {
    expect(parseArgs(["--help", "-h", "--json", "--pretty", "list"])).toEqual({
      options: { help: true, json: true, pretty: true },
      positional: ["list"],
    });
  });

  test("parses the version option", () => {
    expect(parseArgs(["--version"])).toEqual({ options: { version: true }, positional: [] });
  });

  test("parses valued options and positional arguments", () => {
    expect(
      parseArgs([
        "--url",
        "https://example.test/mcp",
        "--token",
        "secret",
        "--transport",
        "sse",
        "call",
        "tool",
        "{}",
      ]),
    ).toEqual({
      options: {
        url: "https://example.test/mcp",
        token: "secret",
        transport: "sse",
      },
      positional: ["call", "tool", "{}"],
    });
  });

  test.each([[["--url"]], [["--token", "--debug"]], [["--transport", "-h"]]])(
    "rejects missing values for valued options: %j",
    (argv) => {
      expect(() => parseArgs(argv)).toThrow(/requires a value/);
    },
  );

  test("rejects an option as a valued option value", () => {
    expect(() => parseArgs(["--url", "--token", "secret"])).toThrow("--url requires a value");
  });

  test("rejects unknown flags", () => {
    expect(() => parseArgs(["--bad"])).toThrow("Unknown option: --bad");
  });

  test("keeps non-option values", () => {
    expect(parseArgs(["-h", "first", "second"])).toEqual({
      options: { help: true },
      positional: ["first", "second"],
    });
  });
});
