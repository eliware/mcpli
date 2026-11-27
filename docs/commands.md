# Command guide

## Command syntax

Use this command pattern:

```text
mcpli [options] <command> [arguments]
```

Put command options before or after command arguments.
Run `mcpli --help` or `mcpli --version` without a command.

## Global options

| Option                | Purpose                            | Value                 |
| --------------------- | ---------------------------------- | --------------------- |
| `--url <url>`         | Set the MCP endpoint               | A server URL          |
| `--token <token>`     | Set the bearer token               | A server token        |
| `--transport <type>`  | Set the connection type            | `http` or `stdio`     |
| `--command <command>` | Set the local stdio server command | A command name        |
| `--args <json-array>` | Set local command arguments        | JSON array of strings |
| `--json`              | Print output as JSON               | None                  |
| `--pretty`            | Indent JSON output                 | None                  |
| `--debug`             | Print structured MCP logs          | None                  |
| `--version`           | Print the package version          | None                  |
| `--help`, `-h`        | Print help                         | None                  |

The default transport is `http`. Read the [user guide](user-guide.md#configuration) for endpoint values.
Use `--command` and optional `--args` with the `stdio` transport.

## `list`

Run `mcpli list` to show the server tools.
Each tool has a name and can include a description and input schema.
The command prints an empty list when the server response has no tools field.

```sh
mcpli list
mcpli --json list
```

## `describe`

Run `mcpli describe <tool>` to show one tool definition.
Replace `<tool>` with the exact tool name from `list`.
mcpli prints an error when the server does not list that name.

```sh
mcpli describe task-search
```

## `call`

Run `mcpli call <tool> [json-arguments]` to call a tool.
Replace `<tool>` with a tool name. Pass arguments as one valid JSON value.
When you omit the JSON value, mcpli sends `{}`.

```sh
mcpli call task-search '{"includes":{"pending":true}}'
mcpli call task-search
```

Surround the full JSON value with the marks that your shell needs.
Read the tool input schema before you call a tool.
The server controls each tool. A tool can change data or cause side effects.
mcpli prints the result from the MCP client.

## `repl`

Run `mcpli repl` to start a prompt.
At the prompt, type `list` to show tools. Type `call <tool> <json>` to call a tool.
Type `call <tool>` to send `{}`. Type `exit` or `quit` to close the prompt.

The prompt supports no other commands.
The prompt prints errors and continues after an invalid command or a server error.

## Output options

Use `--json` to print compact JSON.
Use `--json --pretty` to print indented JSON.
Without `--json`, mcpli prints objects as indented JSON and text as text.
These options apply to one command. The REPL always prints indented JSON.

## Errors and exit codes

mcpli returns `0` when a command completes. It returns `1` when a command fails.
It writes command errors to standard error with the `mcpli:` prefix.
The REPL prints errors with the `Error:` prefix and continues.
The REPL continues after command errors.
