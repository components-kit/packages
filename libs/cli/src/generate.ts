import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { generateTypeScript } from "./codegen";
import { fetchVariants } from "./fetch-variants";

export interface GenerateOptions {
  apiUrl: string;
  check: boolean;
  output: string;
}

export interface GenerateResult {
  componentCount: number;
  outputPath: string;
  upToDate: boolean;
  variantCount: number;
}

export async function generate(
  options: GenerateOptions,
): Promise<GenerateResult> {
  const { apiUrl, check, output } = options;
  const outputPath = resolve(process.cwd(), output);

  console.log(`Fetching component variants from ${apiUrl}...`);

  const data = await fetchVariants(apiUrl);
  const componentCount = Object.keys(data.components).length;
  const variantCount = Object.values(data.components).reduce(
    (sum, component) => sum + component.variants.length,
    0,
  );

  console.log(
    `Found ${componentCount} components with ${variantCount} variants`,
  );

  const content = generateTypeScript(data.components);

  // Check mode: compare against existing file
  if (check) {
    if (!existsSync(outputPath)) {
      throw new Error(
        `File not found: ${outputPath}\nRun \`ck generate\` to create it.`,
      );
    }

    const existing = readFileSync(outputPath, "utf-8");
    const upToDate = existing === content;

    if (upToDate) {
      console.log("Types are up to date.");
    } else {
      console.error("Types are out of date. Run `ck generate` to update.");
    }

    return { componentCount, outputPath, upToDate, variantCount };
  }

  // Write mode: generate type file
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, content, "utf-8");
  console.log(`Generated ${outputPath}`);

  return { componentCount, outputPath, upToDate: true, variantCount };
}
