# Release Notes

## 12.0.0 — 2026-10-13

### Added

The CLI now prints its version when you run `mcpli --version`.
The repository now includes guides for setup, commands, configuration, and troubleshooting.
CI now tests Node.js 26 on pushes and pull requests.
The publish workflow checks the release tag and package version, then publishes with provenance.
The Knit workflow deploys from `/eliware/mcpli` after a push.
The repository now includes an MIT license, Eliware v12 specifications, and shared validation.
Tests now cover CLI parsing, commands, output, and REPL behavior.

### Changed

The package now requires Node.js 26 or later and uses native ESM.
The README and project guidance now describe CLI use, security, operations, and release rules.
The CLI launcher now runs from `bin/mcpli.mjs`. Source modules now live in `src/`.
The CLI now uses `@eliware/mcp-client` 12.0.0 and `@eliware/test` 12.0.0.
The CLI reads endpoint and token values from environment variables. Command-line values take priority.
The package now sets public npm access and provenance.
The user guide now documents commands, configuration, output, security, and exit codes.

### Fixed

The CLI now rejects option values that are missing or start with another option.
The CLI now rejects missing or extra command arguments before it creates a client.
The REPL now reports an error when a `call` command has no tool name.
The CLI now uses `MCP_URL`, `MCP_PORT`, and `MCP_TOKEN` for connection settings.

### Breaking changes

The package now requires Node.js 26 or later.
The root `node.mjs` launcher no longer exists. Run `mcpli` or `node bin/mcpli.mjs`.
The CLI now rejects extra positional values after a command.

### Migration

Install version 12.0.0 and use Node.js 26 or later.
Replace scripts that call `node.mjs` with `mcpli` or `node bin/mcpli.mjs`.
