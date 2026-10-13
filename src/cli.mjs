import { readFileSync } from "node:fs";
import { mcpClient } from "@eliware/mcp-client";
import { HELP, parseArgs } from "./args.mjs";
import { executeCommand } from "./commands.mjs";
import { runRepl } from "./repl.mjs";

export { HELP, parseArgs } from "./args.mjs";
export { formatJson, parseJson } from "./output.mjs";

export async function run(argv, deps = {}) {
  const { options, positional } = parseArgs(argv);
  if (options.version) {
    const packageJson = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    );
    (deps.log || console.log)(packageJson.version);
    return 0;
  }
  if (options.help || positional.length === 0) {
    (deps.log || console.log)(HELP);
    return 0;
  }
  const [command] = positional;
  const commandUsage = {
    list: { counts: [1], text: "mcpli list" },
    describe: { counts: [2], text: "mcpli describe <tool>" },
    call: { counts: [2, 3], text: "mcpli call <tool> [json-arguments]" },
    repl: { counts: [1], text: "mcpli repl" },
  }[command];
  if (commandUsage && !commandUsage.counts.includes(positional.length)) {
    throw new Error(`Usage: ${commandUsage.text}`);
  }
  const factory = deps.clientFactory || mcpClient;
  const client = await factory({
    url:
      options.url ??
      (process.env.MCP_URL || `http://localhost:${process.env.MCP_PORT || 1234}/mcp`),
    token: options.token ?? process.env.MCP_TOKEN,
    transport: options.transport,
    reconnect: false,
    log: options.debug
      ? {
          debug: (...args) => console.error("[mcp:debug]", ...args),
          warn: (...args) => console.error("[mcp:warn]", ...args),
          error: (...args) => console.error("[mcp:error]", ...args),
        }
      : { debug: () => {}, warn: () => {}, error: () => {} },
  });
  try {
    const [command, name, rawArguments] = positional;
    if (command === "repl") await runRepl(client, deps);
    else
      await executeCommand(client, command, name, rawArguments, options, deps.log || console.log);
    return 0;
  } finally {
    await client.close();
  }
}
