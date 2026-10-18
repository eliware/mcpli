const HELP_TEXT = [
  "mcpli — command-line MCP client",
  "",
  "Usage:",
  "  mcpli [options] list",
  "  mcpli [options] describe <tool>",
  "  mcpli [options] call <tool> [json-arguments]",
  "  mcpli [options] repl",
  "",
  "Options:",
  "  --url <url>             Set the MCP endpoint.",
  "                          Default: MCP_URL or localhost:1234/mcp.",
  "  --token <token>         Set the bearer token.",
  "                          Default: MCP_TOKEN.",
  "  --transport <type>      Select http, sse, or stdio.",
  "  --json                  Print JSON on one line.",
  "  --pretty                Indent JSON output.",
  "  --debug                 Print MCP client logs to stderr.",
  "  --version               Print the package version.",
  "  --help                  Print this help.",
];

export const HELP = `${HELP_TEXT.join("\n")}\n`;

export function parseArgs(argv) {
  const options = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--version") options.version = true;
    else if (arg === "--json") options.json = true;
    else if (arg === "--pretty") options.pretty = true;
    else if (arg === "--debug") options.debug = true;
    else if (["--url", "--token", "--transport"].includes(arg)) {
      const value = argv[i + 1];
      if (value === undefined || value === "-h" || value.startsWith("--")) {
        throw new Error(`${arg} requires a value`);
      }
      options[arg.slice(2)] = value;
      i += 1;
    } else if (arg.startsWith("--")) throw new Error(`Unknown option: ${arg}`);
    else positional.push(arg);
  }
  return { options, positional };
}
