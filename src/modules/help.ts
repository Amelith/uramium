import { defineModule } from '@utils/util.ts';

export default defineModule({
  fullName: 'Help',
  description: 'Provides information on how to use a module',
  examples: 'help compareHash',
  arguments: {
    'module': {
      positional: true,
      shortForm: 'm',
      description: 'The module to provide help on',
      nullable: true,
      type: 'string',
      required: false,
    }
  },
  run: (args) => {
    console.log(args);
    return 0;
  }
});
