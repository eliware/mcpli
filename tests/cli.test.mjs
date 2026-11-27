import { jest, test, expect } from "@jest/globals";
import { EventEmitter } from "node:events";
import { Readable } from "node:stream";
const defaultClient = {
  listTools: jest.fn().mockResolvedValue({ tools: [] }),
  close: jest.fn().mockResolvedValue(undefined),
};
jest.unstable_mockModule("@eliware/mcp-client", () => ({
  mcpClient: jest.fn().mockResolvedValue(defaultClient),
}));
const run = (await import("../src/cli.mjs")).default;
const parseArgs = (await import("../src/args.mjs")).default;
const formatJson = (await import("../src/format-json.mjs")).default;

async function silenceConsole(method, callback) {
  const original = console[method];
  console[method] = () => {};
  try {
    return await callback();
  } finally {
    console[method] = original;
  }
}

const makeClient = () => ({
  listTools: jest.fn().mockResolvedValue({ tools: [{ name: "echo", inputSchema: {} }] }),
  callTool: jest.fn().mockResolvedValue({ ok: true }),
  close: jest.fn().mockResolvedValue(undefined),
});

test("parses options and positional arguments", () => {
  expect(parseArgs(["--url", "http://x/mcp", "--json", "call", "echo", "{}"])).toEqual({
    options: { url: "http://x/mcp", json: true },
    positional: ["call", "echo", "{}"],
  });
});

test("formats bigint values safely", () => expect(formatJson({ id: 2n })).toBe('{"id":"2"}'));

test.each([[["--help"]], [["--help", "list"]], [[]]])(
  "prints help without creating a client: %j",
  async (argv) => {
    const log = jest.fn();
    const clientFactory = jest.fn();
    expect(await run(argv, { log, clientFactory })).toBe(0);
    expect(log).toHaveBeenCalledWith(expect.stringContaining("mcpli"));
    expect(clientFactory).not.toHaveBeenCalled();
  },
);

test("prints the package version without creating a client", async () => {
  const log = jest.fn();
  const clientFactory = jest.fn();
  expect(await run(["--version"], { log, clientFactory })).toBe(0);
  expect(log).toHaveBeenCalledWith("15.2.0");
  expect(clientFactory).not.toHaveBeenCalled();
});

test("uses console logging for the package version", async () => {
  await silenceConsole("log", async () => {
    await expect(run(["--version"])).resolves.toBe(0);
  });
});

test("uses console logging for help without a logger", async () => {
  await silenceConsole("log", async () => {
    await expect(run(["--help"])).resolves.toBe(0);
  });
});

test("uses default dependencies and console logging", async () => {
  await silenceConsole("log", async () => {
    expect(await run(["list"])).toBe(0);
  });
  expect(defaultClient.close).toHaveBeenCalled();
});

test("passes debug logger when requested", async () => {
  const client = makeClient();
  const clientFactory = jest.fn().mockResolvedValue(client);
  const logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
  await run(["--debug", "list"], { clientFactory, log: jest.fn(), logger });
  const config = clientFactory.mock.calls[0][0];
  expect(config.logger).toBe(logger);
});

test("passes HTTP options, structured logger, and closes client", async () => {
  const client = makeClient();
  const clientFactory = jest.fn().mockResolvedValue(client);
  const log = jest.fn();
  const logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
  expect(
    await run(["--url", "u", "--token", "t", "--transport", "http", "list"], {
      clientFactory,
      log,
      logger,
    }),
  ).toBe(0);
  expect(clientFactory).toHaveBeenCalledWith(
    expect.objectContaining({ url: "u", token: "t", transport: "http", logger, reconnect: false }),
  );
  expect(log).toHaveBeenCalledWith(expect.stringContaining("echo"));
  expect(client.close).toHaveBeenCalled();
});

test("starts a stdio server and passes its string arguments", async () => {
  const client = makeClient();
  const clientFactory = jest.fn().mockResolvedValue(client);
  const logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
  await run(
    ["--transport", "stdio", "--command", "node", "--args", '["server.mjs","--quiet"]', "list"],
    { clientFactory, log: jest.fn(), logger },
  );
  expect(clientFactory).toHaveBeenCalledWith(
    expect.objectContaining({
      transport: "stdio",
      command: "node",
      args: ["server.mjs", "--quiet"],
      logger,
    }),
  );
});

test.each([
  [["--transport", "stdio", "list"], "node-env", ["server.mjs"]],
  [
    ["--transport", "stdio", "--command", "node-cli", "--args", '["cli.mjs"]', "list"],
    "node-cli",
    ["cli.mjs"],
  ],
])("reads and overrides stdio environment settings: %j", async (argv, command, args) => {
  const prior = { command: process.env.MCP_COMMAND, args: process.env.MCP_ARGS };
  process.env.MCP_COMMAND = "node-env";
  process.env.MCP_ARGS = '["server.mjs"]';
  const clientFactory = jest.fn().mockResolvedValue(makeClient());
  try {
    await run(argv, { clientFactory, log: jest.fn() });
    expect(clientFactory.mock.calls[0][0]).toEqual(expect.objectContaining({ command, args }));
  } finally {
    if (prior.command === undefined) delete process.env.MCP_COMMAND;
    else process.env.MCP_COMMAND = prior.command;
    if (prior.args === undefined) delete process.env.MCP_ARGS;
    else process.env.MCP_ARGS = prior.args;
  }
});

test("rejects stdio without a server command before connecting", async () => {
  const clientFactory = jest.fn();
  await expect(run(["--transport", "stdio", "list"], { clientFactory })).rejects.toThrow(
    "stdio transport requires --command or MCP_COMMAND",
  );
  expect(clientFactory).not.toHaveBeenCalled();
});

test("rejects unsupported transports before connecting", async () => {
  const clientFactory = jest.fn();
  await expect(run(["--transport", "sse", "list"], { clientFactory })).rejects.toThrow(
    "Unsupported transport: sse. Use http or stdio.",
  );
  expect(clientFactory).not.toHaveBeenCalled();
});

test("rejects invalid stdio argument JSON before connecting", async () => {
  const clientFactory = jest.fn();
  await expect(
    run(["--transport", "stdio", "--command", "node", "--args", "{}", "list"], {
      clientFactory,
    }),
  ).rejects.toThrow("--args and MCP_ARGS must contain a JSON array of strings");
  expect(clientFactory).not.toHaveBeenCalled();
});

test("rejects malformed stdio argument JSON before connecting", async () => {
  const clientFactory = jest.fn();
  await expect(
    run(["--transport", "stdio", "--command", "node", "--args", "{", "list"], {
      clientFactory,
    }),
  ).rejects.toThrow("--args and MCP_ARGS must contain a JSON array of strings");
  expect(clientFactory).not.toHaveBeenCalled();
});

test("logs process warnings and errors through the common handlers", async () => {
  const processObj = new EventEmitter();
  const logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
  const client = makeClient();
  const clientFactory = jest.fn(async () => {
    processObj.emit("warning", new Error("test warning"));
    processObj.emit("unhandledRejection", new Error("test rejection"));
    return client;
  });
  await run(["list"], { clientFactory, logger, processObj, log: jest.fn() });
  expect(logger.warn).toHaveBeenCalledWith("Warning", {
    warning: { name: "Error", type: "Error" },
  });
  expect(logger.error).toHaveBeenCalledWith("Unhandled promise error", {
    reasonType: "object",
  });
  expect(processObj.exitCode).toBe(1);
  expect(processObj.listenerCount("warning")).toBe(0);
  expect(processObj.listenerCount("unhandledRejection")).toBe(0);
});

test("closes the client when a shutdown signal arrives", async () => {
  const processObj = new EventEmitter();
  processObj.exit = jest.fn();
  const logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
  let resolveList;
  const client = makeClient();
  client.listTools.mockImplementation(() => new Promise((resolve) => (resolveList = resolve)));
  const pendingRun = run(["list"], {
    clientFactory: jest.fn().mockResolvedValue(client),
    logger,
    processObj,
    log: jest.fn(),
  });
  await Promise.resolve();
  await Promise.resolve();
  processObj.emit("SIGTERM");
  await Promise.resolve();
  await Promise.resolve();
  expect(client.close).toHaveBeenCalled();
  expect(processObj.exit).toHaveBeenCalledWith(130);
  resolveList({ tools: [] });
  await pendingRun;
  expect(processObj.listenerCount("SIGTERM")).toBe(0);
});

test.each([
  ["https://example.test/mcp", "5000", "env-token", "https://example.test/mcp"],
  ["", "5001", "env-token", "http://localhost:5001/mcp"],
  ["", "", "env-token", "http://localhost:1234/mcp"],
])("uses environment connection defaults", async (url, port, token, expectedUrl) => {
  const prior = {
    MCP_URL: process.env.MCP_URL,
    MCP_PORT: process.env.MCP_PORT,
    MCP_TOKEN: process.env.MCP_TOKEN,
  };
  process.env.MCP_URL = url;
  process.env.MCP_PORT = port;
  process.env.MCP_TOKEN = token;
  try {
    const clientFactory = jest.fn().mockResolvedValue(makeClient());
    await run(["list"], { clientFactory, log: jest.fn() });
    expect(clientFactory.mock.calls[0][0]).toEqual(
      expect.objectContaining({ url: expectedUrl, token }),
    );
  } finally {
    for (const [name, value] of Object.entries(prior)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test("describes and calls tools", async () => {
  const client = makeClient();
  const log = jest.fn();
  await run(["--json", "describe", "echo"], {
    clientFactory: jest.fn().mockResolvedValue(client),
    log,
  });
  await run(["--json", "call", "echo", '{"x":1}'], {
    clientFactory: jest.fn().mockResolvedValue(client),
    log,
  });
  expect(client.callTool).toHaveBeenCalledWith({ name: "echo", arguments: { x: 1 } });
});

test("runs repl and closes it", async () => {
  const client = makeClient();
  const output = { write: jest.fn() };
  const input = Readable.from(["exit\n"]);
  await expect(
    run(["repl"], { clientFactory: jest.fn().mockResolvedValue(client), input, output }),
  ).resolves.toBe(0);
  expect(output.write).toHaveBeenCalledWith("mcpli> ");
  expect(client.close).toHaveBeenCalled();
});

test("closes client when command fails", async () => {
  const client = makeClient();
  await expect(
    run(["unknown"], { clientFactory: jest.fn().mockResolvedValue(client) }),
  ).rejects.toThrow("Unknown command");
  expect(client.close).toHaveBeenCalled();
});

test.each([
  [["list", "extra"], "Usage: mcpli list"],
  [["describe"], "Usage: mcpli describe <tool>"],
  [["call", "echo", "{}", "extra"], "Usage: mcpli call <tool> [json-arguments]"],
  [["repl", "extra"], "Usage: mcpli repl"],
])("rejects extra or missing command arguments: %j", async (argv, message) => {
  const clientFactory = jest.fn();
  await expect(run(argv, { clientFactory })).rejects.toThrow(message);
  expect(clientFactory).not.toHaveBeenCalled();
});
