# AGENTS.md

## Project

Build mcpli with Node.js 26 and native ESM. The CLI connects to Model Context Protocol servers.

## Scope and boundaries

This repository owns the mcpli command-line client. It does not own MCP servers or their tools.
The CLI lists tools, describes tool schemas, calls tools, and provides a REPL.

## Layout

Keep implementation modules under `src/`. Keep the launcher under `bin/` and tests under `tests/`.
Keep user documentation under `docs/` and repository specifications under `specs/`.

## Development

Give each source and test module one clear purpose. Keep one matching test for each source module.
Use `@eliware/mcp-client` for MCP transport and client work.

## Validation

Use Node.js 26 or later and native ESM. Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks. Run `npm run audit` for dependency checks.
Run `npm run format` to format files. Run `npm run format:check` to check file format.
Run `npm run pack` before publication review.

## Security

Keep tokens and credentials out of source files, logs, and test output.
Pass credentials with `MCP_TOKEN` or `--token`.

## Changes

Keep user documentation and release notes current. Follow shared conventions and Eliware Operations rules.

## Application

The `mcpli` executable runs `bin/mcpli.mjs`. The CLI runs in a local terminal or in CI.
The CLI does not change MCP server state except when a user calls a tool that changes state.
The CLI accepts `MCP_URL` and `MCP_TOKEN` through `@eliware/mcp-client` defaults.
The CLI supports `--url`, `--token`, and `--transport` options.

## CLI

Use `mcpli --help` to read usage. Use `mcpli --version` to read the package version.
Use `list`, `describe <tool>`, `call <tool> [json-arguments]`, or `repl`.
Use `--json` for machine-readable output and `--pretty` for indented JSON.
Use `--debug` to write client logs to standard error.

## npm publication

The public package is `@eliware/mcpli`. `package.json.version` sets its version.
Run `npm test` and review the package before publication. Publish only through an approved release.
