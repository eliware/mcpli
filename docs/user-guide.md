# User guide

## Purpose

mcpli is a command-line client for Model Context Protocol (MCP) servers.
The CLI lists tools, reads tool schemas, calls tools, and runs a REPL.
The CLI sends each request to the MCP server that you select.
Examine the server and its tools before you send a request.

## Requirements and platform support

Install Node.js 26 or later. Use npm to install mcpli.
The CI workflow tests Node.js 26 on Ubuntu.
The project does not test Windows or macOS.

## Install and check

Install the package for your user:

```sh
npm install --global @eliware/mcpli
```

Check the install:

```sh
mcpli --version
mcpli --help
```

The version command prints the installed package version.
The help command lists commands and options.

## Connect to an MCP server

Set the server URL with `MCP_URL` or `--url`.
The default URL is `http://localhost:1234/mcp`.
When `MCP_URL` is empty, mcpli uses `MCP_PORT` in the local URL.
The default value for `MCP_PORT` is `1234`.

The `http` transport is the default.
Use `sse` for a server that provides legacy SSE.
Use the endpoint path from the server operator.
Streamable HTTP uses `/mcp` when the server defines that path.
Legacy SSE uses `/sse` when the server defines that path.

Set environment values in PowerShell:

```powershell
$env:MCP_URL = "https://mcp.example.com/mcp"
$env:MCP_TOKEN = "YOUR_TOKEN"
mcpli list
```

Set environment values in a POSIX shell:

```sh
export MCP_URL="https://mcp.example.com/mcp"
export MCP_TOKEN="YOUR_TOKEN"
mcpli list
```

Replace each example value with a value from your MCP server operator.
The token is optional when the server does not require authentication.
The client sends `MCP_TOKEN` as a bearer token.
Use `--url` or `--token` to set a value for one command.
A command-line value replaces its matching environment value.

## Work with tools

Use `mcpli list` to show available tools.
Use `mcpli describe <tool>` to show one tool definition and its input schema.
Use `mcpli call <tool> '<json>'` to call a tool with JSON arguments.
When you omit the JSON argument, mcpli sends an empty object.
Surround the full JSON value with the marks that your shell needs.

Read each tool schema before you call the tool.
The server controls tool behavior. A tool can change server data.
Read the [command guide](commands.md) for all commands, options, and results.

## Use the REPL

Run `mcpli repl` to start the interactive prompt.
At the prompt, type `list` to show tools. Type `call <tool> <json>` to call a tool.
Type `call <tool>` to send an empty object as the arguments.
Type `exit` or `quit` to close the REPL.

The REPL accepts blank lines. It prints errors, then shows the prompt again.
The REPL does not provide `describe` or global output flags.

## Read output

By default, mcpli prints objects as indented JSON. It prints text results as text.
Use `--json` to print the result as JSON on one line.
Add `--pretty` to `--json` to indent that JSON.
Use `--debug` to print MCP client logs to standard error.

Debug output can include server details. Keep this information private when it contains sensitive data.

## Configuration

| Name                 | Purpose                          | Default                     |
| -------------------- | -------------------------------- | --------------------------- |
| `MCP_URL`            | MCP endpoint URL                 | `http://localhost:1234/mcp` |
| `MCP_PORT`           | Local URL number                 | `1234`                      |
| `MCP_TOKEN`          | Bearer token for authentication  | No token                    |
| `--url <url>`        | Set the endpoint for one command | `MCP_URL` or default URL    |
| `--token <token>`    | Set the token for one command    | `MCP_TOKEN` or no token     |
| `--transport <type>` | Select `http`, `sse`, or `stdio` | `http`                      |

The MCP client supports stdio when the caller gives it a server command.
mcpli has no option for a server command.
The stdio transport cannot connect through mcpli.

## Connection life cycle

mcpli opens a client when you run a command. It closes the client after that command.
The CLI does not retry a failed connection.
The REPL keeps one client open until you type `exit` or `quit`, or input ends.

## Security

Keep tokens private. Do not add tokens to source files or shared shell history.
Store tokens in environment variables or a shell secret store when possible.
The CLI sends the token to the configured MCP server.
Do not put credentials in the server URL.
Check each tool schema and the MCP server before you call a tool.

## Exit codes

| Code | Meaning                |
| ---- | ---------------------- |
| `0`  | The command completed. |
| `1`  | The command failed.    |

When a command fails, mcpli writes an error to standard error and returns code `1`.
The REPL prints an error and continues. A REPL command error does not close the REPL.
