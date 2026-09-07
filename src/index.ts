import { styleText } from 'node:util';
import { parseArgs } from '@utils/parseArgs.ts';
import help from './modules/help.ts';
import { type ModuleKey, getModuleByName, listModules, listModulesWithDescription } from './modules/modules.ts';
import type { Arguments, Module } from './types.ts';

function main(): void {
  const option = process.argv[2] ?? 'help';

  if (option === 'list') {
    console.log(styleText(['cyan', 'bold'], 'List of available modules:'));
    console.log(
      listModules()
        .map((m) => `- ${styleText('blueBright', m)}`)
        .join('\n'),
    );
  } else if (option === 'list-full') {
    console.log(styleText(['cyan', 'bold'], 'List of available modules:'));
    const m = listModulesWithDescription()
      .map(
        (m) =>
          `- ${styleText('blueBright', `${m.key}:`)}\n`
          + `  ${styleText('cyan', m.fullName)}\n`
          + `   ${m.description
            .split('\n')
            .map((line) => line.padStart(4, ' '))
            .join('\n')}`,
      )
      .join('\n');
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
