# Command guide

## Command form

Use this form:

```text
mcpli [options] <command> [arguments]
```

You can put options before or after command arguments.
Use `mcpli --help` to print usage. Use `mcpli --version` to print the package version.

## Global options

| Option               | Purpose                             | Value                     |
| -------------------- | ----------------------------------- | ------------------------- |
| `--url <url>`        | Set the MCP endpoint                | A server URL              |
| `--token <token>`    | Set the bearer token                | A server token            |
| `--transport <type>` | Set the connection type             | `http`, `sse`, or `stdio` |
| `--json`             | Print output as JSON                | None                      |
| `--pretty`           | Indent JSON output                  | None                      |
| `--debug`            | Print client logs to standard error | None                      |
| `--version`          | Print the package version           | None                      |
| `--help`, `-h`       | Print help                          | None                      |

The default transport is `http`. Read the [user guide](user-guide.md#configuration) for endpoint values.
The stdio option cannot connect because mcpli does not accept a server command.

## `list`

Run `mcpli list` to display the server tools.
Each tool has a name and can include a description and input schema.
The command prints an empty list if the server response has no tools field.

```sh
mcpli list
mcpli --json list
```

## `describe`

Run `mcpli describe <tool>` to display one tool definition.
Replace `<tool>` with the exact tool name from `list`.
mcpli prints an error if the server does not list that name.

```sh
mcpli describe task-search
```

## `call`

Run `mcpli call <tool> [json-arguments]` to call a tool.
Replace `<tool>` with a tool name. Pass arguments as one valid JSON value.
If you omit the argument value, mcpli sends `{}`.

```sh
mcpli call task-search '{"includes":{"pending":true}}'
mcpli call task-search
```

Use the quoting form that your shell needs.
Read the tool input schema before you call it.
The server controls the action. A tool may change data or cause another side effect.
The CLI prints the result that the MCP client returns.

## `repl`

Run `mcpli repl` to start a prompt.
Enter `list` to list tools. Enter `call <tool> <json>` to call a tool.
Enter `call <tool>` to send `{}`. Enter `exit` or `quit` to close the prompt.
The prompt supports no other commands.
It prints errors and continues after an invalid command or a server error.

## Output options

Use `--json` to print a compact JSON result.
Use `--json --pretty` to print an indented JSON result.
Without `--json`, mcpli prints object results as indented JSON and text results as text.
These options apply to one command. The REPL always prints indented JSON results.

## Errors and exit codes

mcpli returns `0` after a successful command. It returns `1` after a command error.
It writes command errors to standard error with the `mcpli:` prefix.
The REPL prints errors with the `Error:` prefix and continues.
The REPL does not return early for a command error.
