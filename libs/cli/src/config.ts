import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CONFIG_FILENAME = "components-kit.config.json";

const DEFAULT_API_URL = "https://api.componentskit.com";
const DEFAULT_OUTPUT = "types/components-kit.d.ts";

export interface CKConfig {
  apiUrl: string;
  output: string;
}

const DEFAULT_CONFIG: CKConfig = {
  apiUrl: DEFAULT_API_URL,
  output: DEFAULT_OUTPUT,
};

/**
 * Resolve the config file path from the current working directory.
 */
function getConfigPath(): string {
  return resolve(process.cwd(), CONFIG_FILENAME);
}

/**
 * Load config from ck.config.json if it exists.
 * Returns defaults for any missing fields.
 */
export function loadConfig(): CKConfig {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }

  const raw = readFileSync(configPath, "utf-8");

  let parsed: Partial<CKConfig>;
  try {
    parsed = JSON.parse(raw) as Partial<CKConfig>;
  } catch {
    console.error(`Invalid JSON in ${configPath}. Using default config.`);
    return { ...DEFAULT_CONFIG };
  }

  return {
    apiUrl: parsed.apiUrl ?? DEFAULT_CONFIG.apiUrl,
    output: parsed.output ?? DEFAULT_CONFIG.output,
  };
}

/**
 * Create a ck.config.json with default values.
 * Returns true if created, false if already exists.
 */
export function createConfig(): boolean {
  const configPath = getConfigPath();

  if (existsSync(configPath)) {
    return false;
  }

  const content = JSON.stringify(DEFAULT_CONFIG, null, 2) + "\n";
  writeFileSync(configPath, content, "utf-8");
  return true;
}
