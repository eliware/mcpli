# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/mcpli [![npm](https://img.shields.io/npm/v/@eliware/mcpli)](https://www.npmjs.com/package/@eliware/mcpli) [![License](https://img.shields.io/github/license/eliware/mcpli)](https://github.com/eliware/mcpli/blob/main/LICENSE) [![CI](https://github.com/eliware/mcpli/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/mcpli/actions/workflows/ci.yaml)

A powerful command-line MCP client for agents, developers, and shell automation.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Configuration](#configuration)
- [Operations](#operations)
- [Commands](#commands)
- [Exit codes](#exit-codes)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

- List tools that an MCP server exposes.
- Read a tool name and input schema.
- Call a tool with JSON arguments.
- Use an interactive REPL.
- Connect with HTTP, SSE, or stdio transport.

## Requirements

Use Node.js 26 or later. Use an MCP server that supports a transport supported by `@eliware/mcp-client`.

## Setup

Install the package with npm:

```sh
npm install --global @eliware/mcpli
```

For local development, run `npm ci` in the repository.

## Usage

Set `MCP_URL` and optional `MCP_TOKEN` values, or pass `--url` and `--token` options.
Use `mcpli --help` to read every option. Read [release notes](RELEASE_NOTES.md) for changes.

```sh
mcpli list
mcpli describe task-search
mcpli call task-search '{"includes":{"pending":true}}'
mcpli --json list
mcpli repl
```

The default endpoint is `http://localhost:1234/mcp`. The default transport is selected by the client.

## Development

Use `npm test` for validation. Read the [documentation index](docs/README.md) and [specification index](specs/README.md).

## Testing

Run `npm test` to run convention checks, lint, format checks, package checks, and Jest tests.
Run `npm run lint`, `npm run format:check`, or `npm run audit` for one check.

## Troubleshooting

Check the endpoint and transport when the CLI cannot connect. Use `--debug` to show client logs.
Use valid JSON for tool arguments. The CLI prints an error and returns exit code 1 when a command fails.

## Security

Keep tokens private. Pass tokens through `MCP_TOKEN` or `--token`.
The CLI sends credentials to the configured MCP server.

## Configuration

| Setting       | Purpose                                   | Default                     |
| ------------- | ----------------------------------------- | --------------------------- |
| `MCP_URL`     | MCP server endpoint                       | `http://localhost:1234/mcp` |
| `MCP_TOKEN`   | Bearer token                              | No token                    |
| `--transport` | Transport type: `http`, `sse`, or `stdio` | Client default              |

Command-line `--url` and `--token` values set the matching client options.

## Operations

The client closes its connection after each command. REPL mode closes when a user enters `exit` or `quit`.
The CLI does not retry a connection after a failure.

## Commands

| Command                              | Action                      |
| ------------------------------------ | --------------------------- |
| `mcpli list`                         | List available tools.       |
| `mcpli describe <tool>`              | Show a tool definition.     |
| `mcpli call <tool> [json-arguments]` | Call a tool.                |
| `mcpli repl`                         | Start the interactive REPL. |
| `mcpli --help`                       | Show usage.                 |
| `mcpli --version`                    | Show the package version.   |

Use `--json` to emit JSON. Use `--pretty` to indent JSON output. Use `--debug` to show client logs.

## Exit codes

| Code | Meaning                |
| ---- | ---------------------- |
| `0`  | The command completed. |
| `1`  | The command failed.    |

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/mcpli)
- [Bug Reports](https://github.com/eliware/mcpli/issues)
- [npm](https://www.npmjs.com/package/@eliware/mcpli)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
