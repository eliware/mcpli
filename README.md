# mcpli

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
