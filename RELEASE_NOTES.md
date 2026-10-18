# Release Notes

## 13.0.0 — 2026-10-17

### Added

The CLI prints its version when you run `mcpli --version`.
The repository includes guides for setup, commands, configuration, and troubleshooting.
The repository includes an MIT license, Eliware v13 specifications, and shared validation.
Tests cover CLI parsing, commands, output, and REPL behavior.
CI tests Node.js 26 on pushes and pull requests.

The npm workflow checks the release tag and package version, then publishes with provenance.
The Knit workflow deploys from `/eliware/mcpli` after a push.

### Changed

The package version is 13.0.0. The package requires Node.js 26 or later and uses native ESM.
The CLI launcher runs from `bin/mcpli.mjs`. Source modules live in `src/`.
The CLI uses `@eliware/mcp-client` 12.0.0 and `@eliware/test` 12.0.0.
The CLI reads endpoint and token values from environment variables.

A command-line value replaces its matching environment value.
The package declares public npm access and provenance.
The README and project guidance describe CLI use, token handling, operations, and release rules.
The user guides tell users about setup, commands, configuration, output, and exit codes.

### Fixed

The CLI rejects missing option values and values that begin with a `--` option.
The CLI rejects command arguments that do not match the command syntax.
The REPL reports an error when a `call` command has no tool name.
The CLI reads connection settings from `MCP_URL`, `MCP_PORT`, and `MCP_TOKEN`.

### Breaking changes

The package requires Node.js 26 or later.
The package no longer includes the root `node.mjs` launcher.
The CLI rejects command arguments that do not match the command syntax.

### Migration

Use Node.js 26 or later.
Change scripts that call `node.mjs` to call `mcpli` or `node bin/mcpli.mjs`.
