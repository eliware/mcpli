# Release Notes

## 1.0.0 — Baseline functionality

Initial release of `@eliware/mcpli`, a command-line client for interacting with Model Context Protocol (MCP) servers.

### Included

- Connect to MCP servers over supported MCP transports.
- List available tools.
- Describe tool definitions and input schemas.
- Invoke tools with JSON arguments.
- Interactive REPL mode.
- JSON and human-readable output modes.
- Pretty-printed JSON output.
- Bearer-token authentication.
- Configurable server URL, token, and transport options.
- Debug logging for troubleshooting MCP client connections.
- ESM-only Node.js implementation.
- Shell-friendly command behavior for agent and automation workflows.

### Quality baseline

- Jest test suite with coverage enabled.
- Oxlint configuration and lint command.
- Coverage-gap reporting via `npm run test:gaps`.
- Node.js 26 CI workflow.
