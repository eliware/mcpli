import { describe, test, expect, jest } from '@jest/globals';
import { Readable, PassThrough } from 'node:stream';
import { runRepl } from '../src/repl.mjs';

function capture() {
  const output = new PassThrough();
  let text = '';
  output.on('data', (chunk) => { text += chunk; });
  return { output, text: () => text };
}

describe('repl', () => {
  test('prompts, lists, calls, handles empty and unknown input, then exits', async () => {
    const client = {
      listTools: jest.fn().mockResolvedValue({ tools: [{ name: 'echo' }] }),
      callTool: jest.fn().mockResolvedValue({ ok: true }),
    };
    const { output, text } = capture();

    await runRepl(client, {
      input: Readable.from(['\n', 'list\n', 'call echo {"x":1}\n', 'wat\n', 'exit\n']),
      output,
    });

    expect(client.listTools).toHaveBeenCalledTimes(1);
    expect(client.callTool).toHaveBeenCalledWith({ name: 'echo', arguments: { x: 1 } });
    expect(text()).toContain('mcpli> ');
    expect(text()).toContain('Commands: list, call <tool> <json>, exit');
  });

  test('uses empty tool list when list response omits tools', async () => {
    const client = { listTools: jest.fn().mockResolvedValue({}) };
    const { output, text } = capture();

    await runRepl(client, {
      input: Readable.from(['list\n', 'quit\n']),
      output,
    });

    expect(text()).toContain('[]');
  });

  test('uses empty JSON arguments and reports client and parse errors', async () => {
    const client = {
      callTool: jest.fn().mockResolvedValue({ ok: true }),
      listTools: jest.fn().mockRejectedValue(new Error('list failed')),
    };
    const { output, text } = capture();

    await runRepl(client, {
      input: Readable.from(['call echo\n', 'list\n', 'call echo {bad\n', 'quit\n']),
      output,
    });

    expect(client.callTool).toHaveBeenCalledWith({ name: 'echo', arguments: {} });
    expect(text()).toContain('Error: list failed');
    expect(text()).toContain('Error:');
  });

  test('uses default options object', async () => {
    const original = Object.getOwnPropertyDescriptor(process, 'stdin');
    Object.defineProperty(process, 'stdin', {
      configurable: true,
      value: Readable.from(['exit\n']),
    });
    try {
      await runRepl({ listTools: jest.fn() });
    } finally {
      Object.defineProperty(process, 'stdin', original);
    }
  });

  test('uses default output stream', async () => {
    await runRepl({ listTools: jest.fn().mockResolvedValue({ tools: [] }) }, {
      input: Readable.from(['list\n', 'exit\n']),
      output: undefined,
    });
  });

  test('uses default input stream', async () => {
    const original = Object.getOwnPropertyDescriptor(process, 'stdin');
    Object.defineProperty(process, 'stdin', {
      configurable: true,
      value: Readable.from(['exit\n']),
    });
    const { output } = capture();
    try {
      await runRepl({ listTools: jest.fn() }, { output });
    } finally {
      Object.defineProperty(process, 'stdin', original);
    }
  });
});
