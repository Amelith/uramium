import { styleText } from 'node:util';
import { defineModule, indentAllButFirstLine } from '@utils/util.ts';
import type { ArgumentConfig, Arguments, ArgumentType } from '../types';
import { getModuleByName, type ModuleKey } from './modules';

const GENERAL_HELP_TEXT = `^w^`;

const helpModule = defineModule({
  fullName: 'Help',
  description: 'Provides information on how to use a module.',
  examples: ['help', 'help compareHash'],
  arguments: {
    'module': {
      description: 'The module to provide help on',
      type: 'string',
      positional: true,
      shortForm: 'm',
    },
  },
  run: (args) => {
    const moduleName = args.module;
    if (!moduleName?.trim()) {
      console.log(GENERAL_HELP_TEXT);
      return 0;
    }

    const module = moduleName === 'help' ? helpModule : getModuleByName(moduleName as ModuleKey);
    if (!module) {
      console.error(`Could not find module ${moduleName}`);
      return 1;
    }

    const helpText = formatModuleConfig(moduleName, module);
    console.log(helpText);
    return 0;
  },
});

function formatModuleConfig(
  moduleName: string | undefined,
  module: { fullName: string; description: string; examples: string | string[]; arguments: Arguments | undefined },
): string {
  const { fullName, description, examples, arguments: moduleArgs } = module;

  const name = styleText(['cyan', 'bold'], fullName);
  const key = moduleName ? `(${styleText('cyan', moduleName)})` : '';

  const desc = indentAllButFirstLine(description);

  const exampleArr = Array.isArray(examples) ? examples : [examples];
  const exampleText = exampleArr.map((e) => `  ${styleText('bgGray', e)}`).join('\n');

  const moduleArgsText =
    moduleArgs === undefined || Object.keys(moduleArgs).length === 0
      ? '  None'
      : Object.entries(moduleArgs).map(formatArgumentConfig).join('\n');

  return `${styleText('gray', 'Module:')} ${name} ${key}
${desc}

${styleText('blueBright', 'Examples:')}
${exampleText}

${styleText('blueBright', 'Arguments:')}
${moduleArgsText}`;
}

function formatArgumentConfig([key, config]: [string, ArgumentConfig<ArgumentType, boolean>]): string {
  const k = styleText('green', key);

  const { description, type, nullable, positional, shortForm, required, defaultValue } = config;
  let configStr = (
    [
      ['Description', indentAllButFirstLine(description, 4)],
      ['Type', type],
      ['Nullable', nullable ?? true],
      ['Positional', positional ?? false],
      ['Short form', shortForm ? `-${shortForm}` : 'Not present'],
      ['Required', required ?? false],
    ] as const
  )
    .map((e) => formatConfigProperty(e))
    .join('\n');

  // Only append default value if it's relevant
  if (!required) configStr += '\n' + formatConfigProperty(['Default value', defaultValue ?? null]);

  return `- ${k}\n${configStr}`;
}

function formatConfigProperty([key, value]: readonly [string, string | number | boolean | null | undefined]): string {
  return `  ${styleText('magenta', key)}: ${value}`;
}

export default helpModule;
