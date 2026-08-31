import { type Module } from '../types.ts';
/*import * as path from 'node:path'

const MODULE_BASE_PATH = import.meta.dirname;*/

/**
 * List of all available modules along with their file path relative to src/modules/.
 * Sorted by name to use bsearch for finding a module by name.
 */
const modules: { name: string, path: string }[] = [
  { name: "createLinuxBrowserShortcut", path: "createLinuxBrowserShortcut" }
] as const;

/**
 * Finds the path of the given module.
 * @param name Module to search for
 * @returns Path of the module, or null if the module wasn't found
 */
function getPathOfModule(name: string): string | null {
  // use bsearch to find module
  let low = 0;
  let high = modules.length;

  while (low <= high) {
    const mid = (low + high) / 2;
    const current = modules[mid];
    if (!current) return null; // if no modules present at all

    if (name > current.name) low = mid + 1;
    else if (name < current.name) high = mid - 1;
    else return current.path;
  }

  return null;
}

async function fetchAllModules(): Promise<Module[]> {
  const results = await Promise.allSettled(
    modules.map(async m => getModuleByPath(m.path))
  );

  // Filter non-rejected, non-null results
  return results
    .filter(r => r.status === 'fulfilled' && r.value !== null)
    .map(r => (r as PromiseFulfilledResult<Module>).value);
}

export function listModules(): string[] {
  return modules.map(m => m.name);
}

export async function listModulesWithDescription() : Promise<{ name: string, description: string }[]> {
  const modules = await fetchAllModules();
  // Only include name and description in the returned array
  return modules.map(r => ({ name: r.name, description: r.description }));
}

/**
 * Finds the given module based on its name. Returns null if the module was not found.
 * @param name The name of the module to find
 * @returns Full module,
 */
async function getModuleByName(name: string) : Promise<Module | null> {
  const modulePath = getPathOfModule(name);
  if (!modulePath) return null;

  return await getModuleByPath(modulePath);
}

async function getModuleByPath(modulePath: string) : Promise<Module | null> {
  //const fullPath = path.join(MODULE_BASE_PATH, modulePath);
  try {
    const { default: module } = (await import(`./${modulePath}`)) as { default: Module };
    return module;
  } catch (_) {
    return null;
  }
}
