# Release Notes

## 15.2.0 — 2026-11-26

### Added

The README links to the repository specifications. The repository includes updated Eliware v13 guidance and specifications.
The CI and npm workflows use current shared actions. The validation workflows fetch full Git history.

### Changed

The package uses @eliware/mcp-client 15.0.1 and @eliware/test 15.2.0. The package version is 15.2.0.
The user guides and CLI argument handling follow current shared conventions.
The npm workflow uses npm.yaml. Knit deployment pulls the repository before dependency installation and testing.

### Fixed

The CLI rejects malformed option values and command arguments before it connects to a server.
The repository meets the package version, environment file, and module export conventions in @eliware/test 15.2.0.

## 12.0.0 — 2026-10-13

### Added

The CLI prints its version with mcpli --version. The repository includes setup, command, configuration, and troubleshooting guides.

CI tests Node.js 26 on pushes and pull requests. The publish workflow checks the release tag and package version, then publishes with provenance.

Knit deploys from /eliware/mcpli after a push. The repository includes an MIT license, Eliware v12 specifications, and shared validation.
Tests cover CLI parsing, commands, output, and REPL behavior.

### Changed

The package requires Node.js 26 or later and uses native ESM. The README and project guidance describe CLI use and release rules.

The CLI launcher is bin/mcpli.mjs. Source modules live in src/. The CLI uses @eliware/mcp-client 12.0.0 and @eliware/test 12.0.0.

The CLI reads endpoint and token values from environment variables. Command-line values replace matching environment values.
The package sets public npm access and provenance. The user guide documents commands, configuration, output, and exit codes.

### Fixed

The CLI rejects option values that are missing or begin with a different option. It rejects invalid command arguments before it creates a client.
The REPL reports an error when a call command has no tool name. The CLI reads MCP_URL, MCP_PORT, and MCP_TOKEN.

### Breaking changes

The package requires Node.js 26 or later. The root node.mjs launcher is removed.
The CLI rejects more positional values after a command.

### Migration

Install version 12.0.0 and use Node.js 26 or later. Replace scripts that call node.mjs with mcpli or node bin/mcpli.mjs.
