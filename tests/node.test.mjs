import { jest, describe, test, expect } from '@jest/globals';
const defaultClient = { listTools: jest.fn().mockResolvedValue({ tools: [] }), close: jest.fn().mockResolvedValue(undefined) };
jest.unstable_mockModule('@eliware/mcp-client', () => ({ mcpClient: jest.fn().mockResolvedValue(defaultClient) }));
const { parseArgs, formatJson, run } = await import('../node.mjs');

const makeClient = () => ({
  listTools: jest.fn().mockResolvedValue({ tools: [{ name: 'echo', inputSchema: {} }] }),
  callTool: jest.fn().mockResolvedValue({ ok: true }),
  close: jest.fn().mockResolvedValue(undefined),
});

describe('node entry point', () => {
  test('parses options and positional arguments', () => {
    expect(parseArgs(['--url', 'http://x/mcp', '--json', 'call', 'echo', '{}'])).toEqual({
      options: { url: 'http://x/mcp', json: true }, positional: ['call', 'echo', '{}'],
    });
  });

  test('formats bigint values safely', () => expect(formatJson({ id: 2n })).toBe('{"id":"2"}'));

  test.each([[['--help']], [['--help', 'list']], [[]]])('prints help without creating a client: %j', async (argv) => {
    const log = jest.fn();
    const clientFactory = jest.fn();
    expect(await run(argv, { log, clientFactory })).toBe(0);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('mcpli'));
    expect(clientFactory).not.toHaveBeenCalled();
  });

  test('uses console logging for help without a logger', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await expect(run(['--help'])).resolves.toBe(0);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('mcpli'));
    spy.mockRestore();
  });

  test('falls back when factory is falsy', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await run(['list'], { clientFactory: null });
    const config = (await import('@eliware/mcp-client')).mcpClient.mock?.calls?.at(-1)?.[0];
    config?.log?.debug?.(); config?.log?.warn?.(); config?.log?.error?.();
    spy.mockRestore();
  });

  test('uses default dependencies and console logging', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    expect(await run(['list'])).toBe(0);
    expect(defaultClient.close).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('passes debug logger when requested', async () => {
    const client = makeClient();
    const clientFactory = jest.fn().mockResolvedValue(client);
    await run(['--debug', 'list'], { clientFactory, log: jest.fn() });
    const config = clientFactory.mock.calls[0][0];
    expect(config.log.debug).toEqual(expect.any(Function));
    expect(config.log.warn).toEqual(expect.any(Function));
    expect(config.log.error).toEqual(expect.any(Function));
    config.log.debug('debug'); config.log.warn('warn'); config.log.error('error');
  });

  test('passes connection options, logs output, and closes client', async () => {
    const client = makeClient();
    const clientFactory = jest.fn().mockResolvedValue(client);
    const log = jest.fn();
    expect(await run(['--url', 'u', '--token', 't', '--transport', 'sse', 'list'], { clientFactory, log })).toBe(0);
    expect(clientFactory).toHaveBeenCalledWith(expect.objectContaining({ url: 'u', token: 't', transport: 'sse', reconnect: false }));
    expect(log).toHaveBeenCalledWith(expect.stringContaining('echo'));
    expect(client.close).toHaveBeenCalled();
  });

  test('describes and calls tools', async () => {
    const client = makeClient();
    const log = jest.fn();
    await run(['--json', 'describe', 'echo'], { clientFactory: jest.fn().mockResolvedValue(client), log });
    await run(['--json', 'call', 'echo', '{"x":1}'], { clientFactory: jest.fn().mockResolvedValue(client), log });
    expect(client.callTool).toHaveBeenCalledWith({ name: 'echo', arguments: { x: 1 } });
  });

  test('runs repl and closes it', async () => {
    const client = makeClient();
    const output = { write: jest.fn() };
    const input = (async function* () { yield 'exit'; })();
    await expect(run(['repl'], { clientFactory: jest.fn().mockResolvedValue(client), input, output })).resolves.toBe(0);
    expect(output.write).toHaveBeenCalledWith('mcpli> ');
    expect(client.close).toHaveBeenCalled();
  });

  test('closes client when command fails', async () => {
    const client = makeClient();
    await expect(run(['unknown'], { clientFactory: jest.fn().mockResolvedValue(client) })).rejects.toThrow('Unknown command');
    expect(client.close).toHaveBeenCalled();
  });
});
