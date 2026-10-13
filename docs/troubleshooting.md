# Troubleshooting guide

## Connection fails

Check that the MCP server is running and that the endpoint is correct.
Check `MCP_URL`, `MCP_PORT`, and `--url` for spelling and value errors.
For the default local endpoint, start a server on port `1234` or set `MCP_PORT`.
Use `--debug` to show client connection logs.

## Authentication fails

Check that the server requires a bearer token.
Set `MCP_TOKEN` or pass `--token` with a valid token.
Check that the token is valid for the endpoint.
Do not include the token in the URL.

## The server rejects the transport

Use `http` for Streamable HTTP servers. This is the default.
Use `--transport sse` only when the server provides legacy SSE.
Use the endpoint path that the server operator provides.
mcpli accepts `--transport stdio`, but it cannot pass a server command.
The stdio transport therefore cannot connect through mcpli.

## The command rejects the input

Use `mcpli --help` to check the command form.
Use the exact tool name from `mcpli list`.
Use that name with `describe` or `call`.
Use valid JSON for call arguments. Quote the full JSON value for your shell.
Read the input schema with `mcpli describe <tool>`.
Call the tool only after you read its input schema.

## A tool returns an error

Check the tool schema and the arguments that you sent.
Check the server response for the tool-specific error.
mcpli prints the returned result. The MCP server controls the tool action.

## The process returns code 1

Code `1` means that a CLI command failed.
Read the `mcpli:` error on standard error.
Check the endpoint, credentials, command, and JSON.
In the REPL, a command error prints `Error:` and the prompt returns.

## Get help

Use the [project issue page](https://github.com/eliware/mcpli/issues) to report a defect.
Do not include tokens, private server URLs, or private tool data in an issue.
