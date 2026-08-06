import { describe, test, expect, jest } from '@jest/globals';
import { executeCommand } from '../src/commands.mjs';

describe('commands', () => {
  test('lists tools and handles missing tools', async () => {
    const client = { listTools: jest.fn().mockResolvedValueOnce({ tools: [{ name: 'echo' }] }).mockResolvedValueOnce({}) };
    const log = jest.fn();

    await executeCommand(client, 'list', null, null, { json: true }, log);
    await executeCommand(client, 'list', null, null, { json: true }, log);
    await executeCommand({ listTools: jest.fn().mockResolvedValue({ tools: [] }) }, 'list', null, null, { json: true });

    expect(log).toHaveBeenNthCalledWith(1, '[{"name":"echo"}]');
    expect(log).toHaveBeenNthCalledWith(2, '[]');
  });

  test('describes tools and rejects missing tools', async () => {
    const client = { listTools: jest.fn().mockResolvedValue({ tools: [{ name: 'echo' }] }) };
    const log = jest.fn();

    await executeCommand(client, 'describe', 'echo', null, { json: true }, log);
    await expect(executeCommand(client, 'describe', 'missing', null, {}, log))
      .rejects.toThrow('Tool not found: missing');
  });

  test('calls tools with JSON and default arguments', async () => {
    const client = { callTool: jest.fn().mockResolvedValue({ ok: true }) };
    const log = jest.fn();

    await executeCommand(client, 'call', 'echo', '{"x":1}', { json: true }, log);
    await executeCommand(client, 'call', 'echo', undefined, { json: true }, log);

    expect(client.callTool).toHaveBeenNthCalledWith(1, { name: 'echo', arguments: { x: 1 } });
    expect(client.callTool).toHaveBeenNthCalledWith(2, { name: 'echo', arguments: {} });
  });

  test('rejects invalid call usage and unknown commands', async () => {
    const client = { callTool: jest.fn() };

    await expect(executeCommand(client, 'call', null, '{}', {}, jest.fn()))
      .rejects.toThrow('Usage: mcpli call <tool> [json-arguments]');
    await expect(executeCommand(client, 'call', 'echo', '{bad', {}, jest.fn()))
      .rejects.toThrow('Invalid JSON arguments');
    await expect(executeCommand(client, 'wat', null, null, {}, jest.fn()))
      .rejects.toThrow('Unknown command: wat');
  });
});
