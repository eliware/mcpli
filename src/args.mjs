export const HELP = `mcpli — command-line MCP client

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
  --debug                 Emit MCP client debug logs to stderr
  --help                  Show this help
`;

export function parseArgs(argv) {
  const options = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--pretty') options.pretty = true;
    else if (arg === '--debug') options.debug = true;
    else if (['--url', '--token', '--transport'].includes(arg)) options[arg.slice(2)] = argv[++i];
    else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else positional.push(arg);
  }
  return { options, positional };
}
