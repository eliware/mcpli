# Release Notes

## 15.2.0 — 2026-11-26

### Added

The CLI starts local MCP servers through stdio. Set the executable with `--command` or `MCP_COMMAND`.
Pass local process arguments as a JSON string array with `--args` or `MCP_ARGS`.
The guides describe shared logging, process error handling, shutdown handling, and APIs that remain local.

CI and npm validation use updated checkout and Node setup actions. Validation jobs fetch full Git history.
Tests cover stdio settings, shared logging, process errors, graceful shutdown, and piped REPL input.

### Changed

The package uses `@eliware/mcp-client` `15.0.1`, `@eliware/common` `15.0.1`, and `@eliware/test` `15.2.0`.
Source modules use one default export. JSON formatting, parsing, and printing each have a separate module.

The CLI runner accepts an injected logger. The MCP client receives structured JSON logs from `@eliware/common`.
The npm workflow uses `npm.yaml`. The Knit deployment runs `git pull`, `npm ci`, and `npm test`.
The README links to the repository specifications. User guides cover stdio settings and shared APIs.

The root ignore file tracks only `.env.example` and ignores other environment files.

### Fixed

The CLI rejects unsupported transports and missing or invalid stdio settings before it connects.
The REPL reads piped input by line, so `list` and `call` work with piped commands.
The CLI reports an error when `--help` or `--version` appears with a command.
The CLI closes its MCP client when a shutdown signal arrives.

### Breaking changes

The CLI no longer accepts the SSE transport. Use HTTP or stdio.
The `--help` and `--version` options require standalone use without a command.

## 12.0.0 — 2026-10-13

### Added

The CLI prints its version with `mcpli --version`.
The repository includes setup, command, configuration, and troubleshooting guides.
CI tests `Node.js` 26 on pushes and pull requests.
The publish workflow checks the release tag and package version, then publishes with provenance.

The Knit workflow deploys from `/eliware/mcpli` after a push.
The repository includes an MIT license, Eliware v12 specifications, and shared validation.
Tests cover CLI parsing, commands, output, and REPL behavior.

### Changed

The package requires `Node.js` 26 or later and uses native ESM.
The README and project guidance describe CLI use, token handling, operations, and release rules.
The CLI launcher is `bin/mcpli.mjs`. Source modules live in `src/`.
The CLI uses `@eliware/mcp-client` `12.0.0` and `@eliware/test` `12.0.0`.

The CLI reads endpoint and token values from environment variables.
Command-line values replace their matching environment values.
The package sets public npm access and provenance.
The user guide covers commands, configuration, output, and exit codes.

### Fixed

The CLI rejects missing option values and values that begin with a `--` prefix.
The CLI rejects invalid command arguments before it creates a client.
The REPL reports an error when a `call` command has no tool name.
The CLI reads `MCP_URL`, `MCP_PORT`, and `MCP_TOKEN`.

### Breaking changes

The package requires `Node.js` 26 or later.
The root `node.mjs` launcher is removed.
The CLI rejects more positional values after a command.

### Migration

Install version `12.0.0` and use `Node.js` 26 or later.
Replace scripts that call `node.mjs` with `mcpli` or `node bin/mcpli.mjs`.
