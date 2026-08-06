# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)
# mcpli [![npm version](https://img.shields.io/npm/v/@eliware/mcpli.svg)](https://www.npmjs.com/package/@eliware/mcpli) [![license](https://img.shields.io/github/license/eliware/mcpli.svg)](LICENSE) [![build status](https://github.com/eliware/mcpli/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/mcpli/actions)

A friendly command-line MCP client for agents and shell automation, powered by [`@eliware/mcp-client`](https://github.com/eliware/mcp-client).

## Usage

```bash
npm install
mcpli list
mcpli describe task-search
mcpli call task-search '{"includes":{"pending":true}}'
mcpli repl
```

Configure remote servers with `MCP_URL` and `MCP_TOKEN`, or pass `--url` and `--token` directly.

## Development

```bash
npm test
npm run lint
```

## Support

For help, questions, or community chat:

[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eli Sterling, eliware.org](LICENSE)

## Links

- [Home Page](https://eliware.org)
- [GitHub Repo](https://github.com/eliware/mcpli)
- [GitHub Org](https://github.com/eliware)
- [Discord](https://discord.gg/M6aTR9eTwN)
