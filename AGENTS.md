# AGENTS.md

## Project

Use Node.js 26 or later. Use native ESM. Build mcpli as an MCP command-line client.

## Scope and boundaries

This repository owns mcpli. The CLI lists tools, reads schemas, calls tools, and runs a REPL.
MCP servers own their tools and server data.

## Layout

Keep source modules in `src/`. Keep the CLI launcher in `bin/` and tests in `tests/`.
Keep user guides in `docs/` and specifications in `specs/`.

## Development

Give each source module one purpose. Keep one matching test file for each source module.
Use `@eliware/mcp-client` for MCP client work.

## Validation

Run the full `npm test` suite before a commit, milestone, or release.
Run `npm run lint` for lint checks. Run `npm run audit` for dependency checks.
Run `npm run format` to format files. Run `npm run format:check` to check formatting.
Run `npm run pack` before publication.

## Security

Keep tokens and credentials out of source files, logs, and test output.
Send credentials only to the configured MCP server.

## Changes

Keep user documents and release notes current. Follow shared conventions and release rules.

## Application

Run `bin/mcpli.mjs` with the `mcpli` command.
The CLI reads `MCP_URL`, `MCP_PORT`, and `MCP_TOKEN`.
The default URL is `http://localhost:1234/mcp`.
The default value for `MCP_PORT` is `1234`.

Use `--url`, `--token`, and `--transport` to set client options.
The CLI closes the client after each command. It does not retry if a command fails.

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Use `mcpli --help` for usage. Use `mcpli --version` to show the package version.
Run `list`, `describe <tool>`, `call <tool> [json-arguments]`, or `repl`.
Use `--json`, `--pretty`, or `--debug` to set output behavior.

## npm publication

The public package is `@eliware/mcpli`.
Find the package version in `package.json`.
Run package validation before publication.
Follow the Eliware Operations approval process.
