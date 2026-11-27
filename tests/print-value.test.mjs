import { describe, test, expect, jest } from "@jest/globals";
import printValue from "../src/print-value.mjs";

describe("printValue", () => {
  test("prints JSON with requested formatting", () => {
    const log = jest.fn();
    printValue({ ok: true }, { json: true }, log);
    printValue({ ok: true }, { json: true, pretty: true }, log);
    expect(log).toHaveBeenCalledWith('{\n  "ok": true\n}');
  });

  test("prints strings and labels", () => {
    const lines = [];
    printValue("hello", { json: false }, (value) => lines.push(value));
    printValue({ ok: true }, { json: false }, (value) => lines.push(value), "Result");
    expect(lines).toEqual(["hello", "Result:", '{\n  "ok": true\n}']);
  });

  test("uses the console logger by default", () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    printValue("hello", { json: false });
    expect(log).toHaveBeenCalledWith("hello");
    log.mockRestore();
  });
});
