import { formatJson, parseJson } from './output.mjs';

export async function runRepl(client, { input = process.stdin, output = process.stdout } = {}) {
  output.write('mcpli> ');
  for await (const line of input) {
    const text = line.trim();
    if (!text) { output.write('mcpli> '); continue; }
    if (text === 'exit' || text === 'quit') break;
    try {
      const [command, name, ...rest] = text.split(/\s+/);
      if (command === 'list') output.write(`${formatJson((await client.listTools()).tools || [], true)}\n`);
      else if (command === 'call') output.write(`${formatJson(await client.callTool({ name, arguments: parseJson(rest.join(' ') || '{}') }), true)}\n`);
      else output.write('Commands: list, call <tool> <json>, exit\n');
    } catch (error) { output.write(`Error: ${error.message}\n`); }
    output.write('mcpli> ');
  }
}
