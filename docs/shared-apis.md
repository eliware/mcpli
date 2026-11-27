# Shared APIs

mcpli depends on `@eliware/common` for logger, process error, and shutdown APIs.
The package re-exports the APIs from `@eliware/log`, `@eliware/errors`, and `@eliware/signals`.

## Structured logs

The CLI sends structured JSON records through the shared logger.
The default log level is `error`. Use `--debug` to include debug records.
The logger omits server URLs, tokens, command arguments, and raw process error values.

When an application calls the CLI runner directly, it can pass `logger` in the dependency options.
The logger must provide `debug`, `info`, `warn`, and `error` methods.
The separate `log` option writes command results for tests or embedding. It does not receive lifecycle records.

## Process errors

The shared error handler listens for process errors, failed promises, and warnings.
It records safe error type details through the shared logger.
A process error or failed promise sets the process exit code to `1`.

## Graceful shutdown

The shared signal handler listens for `SIGINT`, `SIGTERM`, and `SIGHUP` while a client is open.
It closes the MCP client before the process exits with code `130`.
The handler removes its listeners after the command ends.

## APIs that remain local

The shared package does not provide MCP protocol calls, command parsing, JSON rendering, or REPL behavior.
mcpli keeps those functions in its own source modules.
The `@eliware/mcp-client` dependency remains direct because it provides the MCP client.
The `log` output callback remains separate because it prints tool results. It does not write lifecycle records.
