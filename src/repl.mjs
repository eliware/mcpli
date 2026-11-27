import { createInterface } from "node:readline";
import formatJson from "./format-json.mjs";
import parseJson from "./parse-json.mjs";

export default async function runRepl(
  client,
  { input = process.stdin, output = process.stdout } = {},
) {
  const lines = createInterface({ input, crlfDelay: Infinity });
  output.write("mcpli> ");
  try {
    for await (const line of lines) {
      const text = line.trim();
      if (!text) {
        output.write("mcpli> ");
        continue;
      }
      if (text === "exit" || text === "quit") break;
      try {
        const [command, name, ...rest] = text.split(/\s+/);
        if (command === "list")
          output.write(`${formatJson((await client.listTools()).tools || [], true)}\n`);
        else if (command === "call") {
          if (!name) throw new Error("Usage: call <tool> [json]");
          output.write(
            `${formatJson(await client.callTool({ name, arguments: parseJson(rest.join(" ") || "{}") }), true)}\n`,
          );
        } else output.write("Commands: list, call <tool> <json>, exit\n");
      } catch (error) {
        output.write(`Error: ${error.message}\n`);
      }
      output.write("mcpli> ");
    }
  } finally {
    lines.close();
  }
}
