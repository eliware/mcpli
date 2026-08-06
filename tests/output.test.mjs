import { describe, test, expect, jest } from '@jest/globals';
import { formatJson, parseJson, printValue } from '../src/output.mjs';

describe('output', () => {
  test('formats JSON and bigint values', () => {
    expect(formatJson({ id: 2n })).toBe('{"id":"2"}');
    expect(formatJson({ id: 2n }, true)).toBe('{\n  "id": "2"\n}');
  });

  test('parses JSON and uses an empty object by default', () => {
    expect(parseJson('{"x":1}')).toEqual({ x: 1 });
    expect(parseJson()).toEqual({});
  });

  test('rejects malformed JSON with the parser message', () => {
    expect(() => parseJson('{bad')).toThrow('Invalid JSON');
  });

  test('prints JSON using requested formatting', () => {
    const log = jest.fn();
    const value = { ok: true };

    printValue(value, { json: true });
    printValue(value, { json: true, pretty: true }, log);

    expect(log).toHaveBeenCalledWith('{\n  "ok": true\n}');
  });

  test('prints strings directly', () => {
    const log = jest.fn();
    expect(printValue('hello', { json: false }, log)).toBeUndefined();
    expect(log).toHaveBeenCalledWith('hello');
  });

  test('prints labelled and unlabelled values', () => {
    const labelled = [];
    const unlabelled = [];

    printValue({ ok: true }, { json: false }, value => labelled.push(value), 'Result');
    printValue({ ok: true }, { json: false }, value => unlabelled.push(value));

    expect(labelled).toEqual(['Result:', '{\n  "ok": true\n}']);
    expect(unlabelled).toEqual(['{\n  "ok": true\n}']);
  });
});
