import { listModules } from './modules/modules.ts';
import { parseArgs } from 'node:util'

function main() : void {
  console.log(listModules());
}


//modules.createLinuxBrowserShortcut.run();
main();
