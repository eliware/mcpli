# AGENTS.md

## Project

Use Node.js 26 or later with native ESM. Build mcpli as an MCP command-line client.

## Scope and boundaries

This repository owns mcpli. The CLI lists tools, describes tools, calls tools, and runs a REPL.
MCP servers own their tools and server data.

## Layout

Keep implementation modules in `src/`. Keep the CLI launcher in `bin/` and tests in `tests/`.
Keep end-user documents in `docs/` and specifications in `specs/`.

## Development

Give each source and test module one purpose. Keep one matching test for each source module.
Use `@eliware/mcp-client` for MCP client work.

## Validation

Run `npm test` for aggregate validation. Run `npm run lint` for lint checks.
Run `npm run audit` for audit checks. Run `npm run format` to format files.
Run `npm run format:check` to check files. Run `npm run pack` before publication review.

## Security

Keep tokens and credentials out of source files, logs, and test output.
Send credentials only to the configured MCP server.

## Changes

Keep user documents and release notes current. Follow the shared conventions and release rules.

## Application

Run `bin/mcpli.mjs` through the `mcpli` command. The CLI reads `MCP_URL`, `MCP_PORT`, and `MCP_TOKEN`.
The URL defaults to `http://localhost:1234/mcp`. The port defaults to `1234`.
Use `--url`, `--token`, and `--transport` to set client options.
The CLI closes the client after each command. It does not retry after a connection failure.

## CLI

Use `mcpli --help` for usage. Use `mcpli --version` for the package version.
Run `list`, `describe <tool>`, `call <tool> [json-arguments]`, or `repl`.
Use `--json`, `--pretty`, or `--debug` to set output behavior.

## npm publication

The public package is `@eliware/mcpli`. The package version is in `package.json`.
Run package validation before publication. Follow the Eliware Operations approval process.
