import { jest, describe, test, expect } from '@jest/globals';
import { parseArgs, formatJson, run } from '../node.mjs';

describe('mcpli', () => {
  test('parses options and positional arguments', () => {
    expect(parseArgs(['--url', 'http://x/mcp', '--json', 'call', 'echo', '{}'])).toEqual({
      options: { url: 'http://x/mcp', json: true }, positional: ['call', 'echo', '{}'],
    });
  });
  test('formats bigint values safely', () => expect(formatJson({ id: 2n })).toBe('{"id":"2"}'));
  test('lists tools', async () => {
    const client = { listTools: jest.fn().mockResolvedValue({ tools: [{ name: 'echo' }] }), close: jest.fn() };
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await run(['--json', 'list'], { clientFactory: jest.fn().mockResolvedValue(client) });
    expect(client.listTools).toHaveBeenCalled(); expect(spy).toHaveBeenCalledWith('[{"name":"echo"}]'); spy.mockRestore();
  });
  test('describes and calls tools', async () => {
    const client = { listTools: jest.fn().mockResolvedValue({ tools: [{ name: 'echo', inputSchema: {} }] }), callTool: jest.fn().mockResolvedValue({ ok: true }), close: jest.fn() };
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await run(['--json', 'describe', 'echo'], { clientFactory: jest.fn().mockResolvedValue(client) });
    await run(['--json', 'call', 'echo', '{"x":1}'], { clientFactory: jest.fn().mockResolvedValue(client) });
    expect(client.callTool).toHaveBeenCalledWith({ name: 'echo', arguments: { x: 1 } }); spy.mockRestore();
  });
  test('rejects invalid JSON and missing tools', async () => {
    const client = { listTools: jest.fn().mockResolvedValue({ tools: [] }), close: jest.fn() };
    await expect(run(['describe', 'missing'], { clientFactory: jest.fn().mockResolvedValue(client) })).rejects.toThrow('Tool not found');
    await expect(run(['call', 'echo', '{bad'], { clientFactory: jest.fn().mockResolvedValue(client) })).rejects.toThrow('Invalid JSON');
  });
});
