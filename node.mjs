#!/usr/bin/env node
import { mcpClient } from '@eliware/mcp-client';

const HELP = `mcpli — command-line MCP client

Usage:
  mcpli [options] list
  mcpli [options] describe <tool>
  mcpli [options] call <tool> [json-arguments]
  mcpli [options] repl

Options:
  --url <url>             MCP endpoint (default: MCP_URL or localhost:1234/mcp)
  --token <token>         Bearer token (or MCP_TOKEN)
  --transport <type>      http, sse, or stdio
  --json                  Emit machine-readable JSON only
  --pretty                Pretty-print JSON output
  --help                  Show this help

Examples:
  mcpli list
  mcpli --token "$MCP_TOKEN" call task-create '{"title":"Review logs"}'
  mcpli --json describe task-search
  mcpli repl
`;

export function parseArgs(argv) {
  const options = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--pretty') options.pretty = true;
    else if (['--url', '--token', '--transport'].includes(arg)) options[arg.slice(2)] = argv[++i];
    else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else positional.push(arg);
  }
  return { options, positional };
}

export function formatJson(value, pretty = false) {
  return JSON.stringify(value, (_, item) => typeof item === 'bigint' ? item.toString() : item, pretty ? 2 : 0);
}

function output(value, options, label = '') {
  if (options.json) return console.log(formatJson(value, options.pretty));
  if (typeof value === 'string') return console.log(value);
  if (label) console.log(`${label}:`);
  console.log(formatJson(value, true));
}

function parseJson(value = '{}') {
  try { return JSON.parse(value); } catch (error) { throw new Error(`Invalid JSON arguments: ${error.message}`); }
}

export async function run(argv, deps = {}) {
  const { options, positional } = parseArgs(argv);
  if (options.help || positional.length === 0) { console.log(HELP); return 0; }
  const clientFactory = deps.clientFactory || mcpClient;
  const client = await clientFactory({
    url: options.url,
    token: options.token,
    transport: options.transport,
    reconnect: false,
    log: { debug: () => {}, warn: () => {}, error: () => {} },
  });
  try {
    const [command, name, rawArguments] = positional;
    if (command === 'list') {
      const result = await client.listTools();
      output(result.tools || result, options);
    } else if (command === 'describe') {
      const result = await client.listTools();
      const tool = result.tools?.find(item => item.name === name);
      if (!tool) throw new Error(`Tool not found: ${name}`);
      output(tool, options);
    } else if (command === 'call') {
      if (!name) throw new Error('Usage: mcpli call <tool> [json-arguments]');
      output(await client.callTool({ name, arguments: parseJson(rawArguments) }), options);
    } else if (command === 'repl') {
      await runRepl(client, options, deps);
    } else throw new Error(`Unknown command: ${command}`);
    return 0;
  } finally { await client.close(); }
}

async function runRepl(client, options, deps = {}) {
  const input = deps.input || process.stdin;
  const outputStream = deps.output || process.stdout;
  outputStream.write('mcpli> ');
  for await (const line of input) {
    const text = line.trim();
    if (!text) { outputStream.write('mcpli> '); continue; }
    if (text === 'exit' || text === 'quit') break;
    try {
      const [command, name, ...rest] = text.split(/\s+/);
      if (command === 'list') outputStream.write(`${formatJson((await client.listTools()).tools || [], true)}\n`);
      else if (command === 'call') outputStream.write(`${formatJson(await client.callTool({ name, arguments: parseJson(rest.join(' ') || '{}') }), true)}\n`);
      else outputStream.write('Commands: list, call <tool> <json>, exit\n');
    } catch (error) { outputStream.write(`Error: ${error.message}\n`); }
    outputStream.write('mcpli> ');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run(process.argv.slice(2)).catch(error => { console.error(`mcpli: ${error.message}`); process.exitCode = 1; });
}
