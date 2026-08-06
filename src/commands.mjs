import { parseJson, printValue } from './output.mjs';

export async function executeCommand(client, command, name, rawArguments, options, log = console.log) {
  if (command === 'list') return printValue((await client.listTools()).tools || [], options, log);
  if (command === 'describe') {
    const tool = (await client.listTools()).tools?.find(item => item.name === name);
    if (!tool) throw new Error(`Tool not found: ${name}`);
    return printValue(tool, options, log);
  }
  if (command === 'call') {
    if (!name) throw new Error('Usage: mcpli call <tool> [json-arguments]');
    return printValue(await client.callTool({ name, arguments: parseJson(rawArguments) }), options, log);
  }
  throw new Error(`Unknown command: ${command}`);
}
