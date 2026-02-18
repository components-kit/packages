/**
 * @components-kit/cli — Generate type-safe variant definitions from the ComponentsKit API.
 *
 * Provides the `ck` binary with two commands:
 * - `ck init` — scaffold a components-kit.config.json
 * - `ck generate` — fetch variants and emit a .d.ts augmentation file
 */

import { Command } from "commander";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createConfig, loadConfig } from "./config";
import { generate } from "./generate";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "../package.json"), "utf-8"),
) as { version: string };
const { version } = pkg;

const program = new Command();

program
  .name("ck")
  .description("CLI tool for ComponentsKit design system")
  .version(version);

program
  .command("init")
  .description("Create a components-kit.config.json with default settings")
  .action(() => {
    const created = createConfig();

    if (created) {
      console.log("Created components-kit.config.json");
    } else {
      console.log("components-kit.config.json already exists, skipping.");
    }
  });

program
  .command("generate")
  .description("Generate TypeScript types for component variants")
  .option("-o, --output <path>", "Output file path")
  .option("--api-url <url>", "API base URL")
  .option("--check", "Check if types are up to date (for CI/CD)", false)
  .action(
    async (options: { apiUrl?: string; check: boolean; output?: string }) => {
      const config = loadConfig();

      const result = await generate({
        apiUrl: options.apiUrl ?? config.apiUrl,
        check: options.check,
        output: options.output ?? config.output,
      });

      if (options.check && !result.upToDate) {
        process.exit(1);
      }
    },
  );

program.parse();
