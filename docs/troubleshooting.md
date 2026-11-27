# Troubleshooting guide

## Connection fails

Check that the MCP server runs and that its endpoint is correct.
Check `MCP_URL`, `MCP_PORT`, and `--url` for spelling and value errors.
For the default local endpoint, set `MCP_PORT` to `1234` or set `MCP_URL`.
Use `--debug` to show client connection logs.

## Authentication fails

If the server requires a bearer token, set `MCP_TOKEN` or pass `--token` with a valid token.
Check that the token works with the endpoint.
Do not include the token in the URL.

## The server rejects the transport

Use `http` for Streamable HTTP servers. This is the default.
Use the endpoint path from the server operator.
Use `--transport stdio` with `--command` to connect to a local server.
Pass server arguments as a JSON string array through `--args` or `MCP_ARGS`.

## The command rejects the input

Use `mcpli --help` to check command syntax.
Use the exact tool name from `mcpli list`.
Use that name with `describe` or `call`.
Use valid JSON for call arguments.
Surround the full JSON value with the marks that your shell needs.
Read the input schema with `mcpli describe <tool>` before you call a tool.

## A tool returns an error

Check the tool schema and the arguments that you sent.
Check the server response for the tool error.
mcpli prints the result that the MCP server returns.

## The process returns code 1

Code `1` means that a CLI command failed.
Read the `mcpli:` error on standard error.
Check the endpoint, credentials, command, and JSON.
In the REPL, a command error prints `Error:` and the prompt returns.

## Support

Use the [project issue page](https://github.com/eliware/mcpli/issues) to report a defect.
Do not include tokens, private server URLs, or private tool data in an issue.
