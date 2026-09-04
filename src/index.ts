import help from './modules/help.ts';
import { parseArgs } from '@utils/parseArgs.ts';
import type { Arguments, Module } from './types.ts';
import { type ModuleKey, getModuleByName, listModules, listModulesWithDescription } from './modules/modules.ts';

function main(): void {
  const option = process.argv[2] ?? 'help';

  if (option === 'list') {
    console.log('List of available modules:');
    console.log(listModules().map(m => `- ${m}`).join('\n'));
  } else if (option === 'list-full') {
    console.log('List of available modules:');
    const m = listModulesWithDescription().map(m =>
      `- ${m.key}:\n` +
      ` - Full name: ${m.fullName}\n` +
      ` - Description: ${m.description
        .split('\n')
        .map(line => line.padStart(4, ' '))
        .join('\n')
      }`
    ).join('\n')
    console.log(m);
  } else {
    // parse args & call selected module
    const module = (option === 'help' ? help : getModuleByName(option as ModuleKey)) as Module<Arguments | undefined>;
    if (module === null) {
      console.error(`Requested module ${option} not found.`);
      process.exit(1);
    }

    // no need to parse args if none are required
    if (module.arguments === undefined) {
      const exitCode = module.run();
      process.exit(exitCode);
    }

    const argv = process.argv.slice(3);
    try {
      const parsedArgs = parseArgs(argv, module.arguments);
      module.run(parsedArgs);
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
      else console.error(e);
    }
  }
}

main();
