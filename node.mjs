#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mcpClient } from '@eliware/mcp-client';
import { HELP, parseArgs } from './src/args.mjs';
import { executeCommand } from './src/commands.mjs';
import { runRepl } from './src/repl.mjs';

export { HELP, parseArgs } from './src/args.mjs';
export { formatJson, parseJson } from './src/output.mjs';

export async function run(argv, deps = {}) {
  const { options, positional } = parseArgs(argv);
  if (options.help || positional.length === 0) {
    (deps.log || console.log)(HELP);
    return 0;
  }
  const factory = deps.clientFactory || mcpClient;
  const client = await factory({
    url: options.url,
    token: options.token,
    transport: options.transport,
    reconnect: false,
    log: options.debug
      ? { debug: (...args) => console.error('[mcp:debug]', ...args), warn: (...args) => console.error('[mcp:warn]', ...args), error: (...args) => console.error('[mcp:error]', ...args) }
      : { debug: () => {}, warn: () => {}, error: () => {} },
  });
  try {
    const [command, name, rawArguments] = positional;
    if (command === 'repl') await runRepl(client, deps);
    else await executeCommand(client, command, name, rawArguments, options, deps.log || console.log);
    return 0;
  } finally {
    await client.close();
  }
}

/* istanbul ignore if -- exercised only when invoked as the CLI entry point. */
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run(process.argv.slice(2)).catch(error => { console.error(`mcpli: ${error.message}`); process.exitCode = 1; });
}
