import { readFileSync } from "node:fs";
import { createLogger, registerHandlers, registerSignals } from "@eliware/common";
import { mcpClient } from "@eliware/mcp-client";
import parseArgs from "./args.mjs";
import executeCommand from "./commands.mjs";
import runRepl from "./repl.mjs";

const HELP_TEXT =
  [
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
    "  --transport <type>      Select http or stdio.",
    "  --command <command>     Set the local stdio server command.",
    "  --args <json-array>     Set arguments for the local stdio command.",
    "  --json                  Print JSON on one line.",
    "  --pretty                Indent JSON output.",
    "  --debug                 Print structured MCP logs.",
    "  --version               Print the package version.",
    "  --help                  Print this help.",
  ].join("\n") + "\n";

export default async function run(argv, deps = {}) {
  const { options, positional } = parseArgs(argv);
  const logLevel = options.debug ? "debug" : "error";
  const logger = deps.logger || createLogger({ level: logLevel, format: "json" });
  const processObj = deps.processObj || process;
  const processLogger = {
    error: (...values) => {
      processObj.exitCode = 1;
      logger.error(...values);
    },
    warn: (...values) => logger.warn(...values),
    debug: (...values) => logger.debug(...values),
  };
  const errorHandlers = registerHandlers({ processObj, log: processLogger });
  let signalHandlers;
  let client;
  try {
    if (options.help && positional.length > 0) {
      throw new Error("--help cannot be combined with a command");
    }
    if (options.version && positional.length > 0) {
      throw new Error("--version cannot be combined with a command");
    }
    if (options.version) {
      const packageJson = JSON.parse(
        readFileSync(new URL("../package.json", import.meta.url), "utf8"),
      );
      (deps.log || console.log)(packageJson.version);
      return 0;
    }
    if (options.help || positional.length === 0) {
      (deps.log || console.log)(HELP_TEXT);
      return 0;
    }
    const [action] = positional;
    const commandUsage = {
      list: { counts: [1], text: "mcpli list" },
      describe: { counts: [2], text: "mcpli describe <tool>" },
      call: { counts: [2, 3], text: "mcpli call <tool> [json-arguments]" },
      repl: { counts: [1], text: "mcpli repl" },
    }[action];
    if (commandUsage && !commandUsage.counts.includes(positional.length)) {
      throw new Error(`Usage: ${commandUsage.text}`);
    }
    const transport = options.transport;
    if (transport && transport !== "http" && transport !== "stdio") {
      throw new Error(`Unsupported transport: ${transport}. Use http or stdio.`);
    }
    const commandName = options.command ?? process.env.MCP_COMMAND;
    const rawArgs = options.args ?? process.env.MCP_ARGS;
    let args;
    if (rawArgs !== undefined) {
      try {
        args = JSON.parse(rawArgs);
      } catch {
        throw new Error("--args and MCP_ARGS must contain a JSON array of strings");
      }
      if (!Array.isArray(args) || args.some((value) => typeof value !== "string")) {
        throw new Error("--args and MCP_ARGS must contain a JSON array of strings");
      }
    }
    if (transport === "stdio" && !commandName) {
      throw new Error("stdio transport requires --command or MCP_COMMAND");
    }
    const factory = deps.clientFactory || mcpClient;
    client = await factory({
      url:
        options.url ??
        (process.env.MCP_URL || `http://localhost:${process.env.MCP_PORT || 1234}/mcp`),
      token: options.token ?? process.env.MCP_TOKEN,
      transport,
      command: commandName,
      args,
      reconnect: false,
      logger,
    });
    signalHandlers = registerSignals({
      processObj,
      log: processLogger,
      shutdownHook: () => client.close(),
      exitCode: 130,
    });
    const [command, name, rawArguments] = positional;
    if (command === "repl") await runRepl(client, deps);
    else
      await executeCommand(client, command, name, rawArguments, options, deps.log || console.log);
    return 0;
  } finally {
    signalHandlers?.removeHandlers();
    if (client) await client.close();
    errorHandlers.removeHandlers();
  }
}
