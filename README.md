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

The CLI has `list`, `describe`, `call`, and `repl` commands.
Read the [documentation index](docs/README.md).

## Requirements

Use Node.js 26 or later.

## Setup

Install mcpli with npm:

```sh
npm install --global @eliware/mcpli
```

## Usage

Set `MCP_URL` and optional `MCP_TOKEN` values. Use `--url` and `--token` for one command.
Read the [user guide](docs/user-guide.md) and [release notes](RELEASE_NOTES.md).

```sh
mcpli list
mcpli call task-search '{"includes":{"pending":true}}'
```

## Development

Run `npm ci`. Then run `npm test`.

## Testing

Run `npm test` to check the repository.

## Troubleshooting

Read the [troubleshooting guide](docs/troubleshooting.md).

## Security

Keep tokens private. Send credentials only to the MCP server that you select.

## Configuration

Set `MCP_URL`, `MCP_PORT`, and `MCP_TOKEN`, or set `--url`, `--token`, and `--transport`.
Read [configuration details](docs/user-guide.md#configuration).

## Operations

The client closes after each command. Read the [user guide](docs/user-guide.md) for connection details.

## Commands

Use `list`, `describe <tool>`, `call <tool> [json-arguments]`, or `repl`.
Read the [command guide](docs/commands.md) for options and results.

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
