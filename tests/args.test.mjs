import { describe, test, expect } from '@jest/globals';
import { parseArgs } from '../src/args.mjs';

describe('args', () => {
  test('parses help aliases and output flags', () => {
    expect(parseArgs(['--help', '-h', '--json', '--pretty', 'list'])).toEqual({
      options: { help: true, json: true, pretty: true },
      positional: ['list'],
    });
  });

  test('parses valued options and positional arguments', () => {
    expect(parseArgs([
      '--url', 'https://example.test/mcp',
      '--token', 'secret',
      '--transport', 'sse',
      'call', 'tool', '{}',
    ])).toEqual({
      options: {
        url: 'https://example.test/mcp',
        token: 'secret',
        transport: 'sse',
      },
      positional: ['call', 'tool', '{}'],
    });
  });

  test('accepts missing values for valued options', () => {
    expect(parseArgs(['--url'])).toEqual({ options: { url: undefined }, positional: [] });
  });

  test('rejects unknown flags', () => {
    expect(() => parseArgs(['--bad'])).toThrow('Unknown option: --bad');
  });

  test('keeps non-option values', () => {
    expect(parseArgs(['-h', 'first', 'second'])).toEqual({
      options: { help: true },
      positional: ['first', 'second'],
    });
  });
});
