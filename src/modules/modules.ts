import compareHash from './compareHash/main.ts'
import createLinuxWebsiteShortcut from './createLinuxWebsiteShortcut/main.ts';

export type ModuleKey = keyof typeof modules;
export type ModuleForKey<K extends ModuleKey> = typeof modules[K];

/**
 * List of all available modules.
 */
const modules = {
  'createLinuxWebsiteShortcut': createLinuxWebsiteShortcut,
  'compareHash': compareHash,
} as const;

export function listModules(): ModuleKey[] {
  return Object.keys(modules) as ModuleKey[];
}

export function listModulesWithDescription() : { key: ModuleKey, fullName: string, description: string }[] {
  return Object.entries(modules)
    .map(([key, module]) => ({
      key: key as ModuleKey,
      fullName: module.fullName,
      description: module.description
    }));
}

/**
 * Finds the given module based on its name. Returns null if the module was not found.
 * @param key The name of the module to find
 * @returns Full module, or null if not present
 */
export function getModuleByName<K extends ModuleKey>(key: K) : ModuleForKey<K> | null {
  return modules[key] ?? null;
}
