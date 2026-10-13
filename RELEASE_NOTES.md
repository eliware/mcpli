# Release Notes

## 12.0.0 — 2026-10-12

### Added

Added `mcpli --version` and end-user guides for setup, configuration, commands, and troubleshooting.
Added CI validation, npm publication, and the Knit deployment workflow.

### Changed

Set Node.js 26 as the minimum version and aligned package metadata with Eliware v12 conventions.
Updated `@eliware/mcp-client` to 1.1.4 and added `@eliware/test` 12.0.0 for repository validation.
Moved the CLI launcher to `bin/` and moved command orchestration to `src/`.
Changed validation to run through `@eliware/test` with full source coverage.
Updated the README, contributor instructions, license, specifications, and release process.
