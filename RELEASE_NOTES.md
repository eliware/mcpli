# Release Notes

## 1.0.2 - Unreleased

Recent updates since 1.0.1:

- Fixed global CLI entrypoint invocation.
- Added manual Node.js workflow dispatch support.
- Updated `@eliware/mcp-client` from `^1.1.2` to `^1.1.3`.
- Ignored local Jest result files (`.jest.result`).
- Ignored local AgentX artifacts (`.agentx*`).

## 1.0.1 - August 6, 2026

- Bumped package version from 1.0.0 to 1.0.1.
- Included the Jest result file in the release snapshot.

## 1.0.0 - August 6, 2026

Initial release of mcpli, including:

- MCP CLI commands: `list`, `describe`, `call`, and `repl`.
- HTTP, SSE, and stdio transport options.
- JSON and pretty-print output modes.
- MCP client debug logging.
- Node.js 26 CI workflow.
- Complete automated test coverage.
