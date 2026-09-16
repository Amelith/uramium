import { styleText } from 'node:util';
import { defineModule } from '@utils/util.ts';

export default defineModule({
  fullName: 'Find Environment Variable',
  description: 'Finds environment variable(s) based on its value (via regular expressions)',
  examples: 'findEnvVar Pictures',
  arguments: {
    'value': {
      description: 'Value of env var to find',
      type: 'string',
      positional: true,
      shortForm: 'v',
      required: true,
    },
    'flags': {
      description: 'Regular expression flags to use',
      type: 'string',
      shortForm: 'f',
      defaultValue: 'i',
    },
    'includePath': {
      description: 'Whether to also search the PATH environment variable',
      type: 'boolean',
      nullable: false,
      defaultValue: false,
    },
  },
  run: (args) => {
    const { value, flags, includePath } = args;
    const regex = new RegExp(value, flags ?? undefined);

    const matchingEnvVars = Object.entries(process.env).filter(([k, v]) => {
      if (!v) return false;
      if (!includePath && k.toUpperCase() === 'PATH') return false;

      return regex.test(v);
    });

    const output = matchingEnvVars.map(([k, v]) => `- ${styleText('magenta', k)}: ${v}`).join('\n');

    console.log(styleText(['blueBright', 'bold'], 'Environment variables matching the provided value:'));
    console.log(output);

    return 0;
  },
});
