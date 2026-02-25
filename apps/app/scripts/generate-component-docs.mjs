/* eslint-disable no-console */
import { marked } from "marked";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const COMPONENTS_DIR = path.resolve(
  APP_ROOT,
  "../../libs/react/src/components",
);
const OUT_FILE = path.join(APP_ROOT, "src/app/generated/component-docs.json");

const COMPONENT_IDS = [
  "alert",
  "badge",
  "button",
  "checkbox",
  "combobox",
  "heading",
  "icon",
  "input",
  "multi-select",
  "pagination",
  "progress",
  "radio-group",
  "select",
  "separator",
  "skeleton",
  "slider",
  "switch",
  "table",
  "tabs",
  "text",
  "textarea",
  "toast",
];

const entries = await Promise.all(
  COMPONENT_IDS.map(async (id) => {
    try {
      const raw = await fs.readFile(
        path.join(COMPONENTS_DIR, id, "README.md"),
        "utf-8",
      );
      const tokens = [...marked.lexer(raw)];
      return [id, tokens];
    } catch {
      console.warn(`⚠ No README.md found for "${id}", skipping.`);
      return [id, []];
    }
  }),
);

const docs = Object.fromEntries(entries);
const loaded = entries.filter(([, t]) => t.length > 0).length;

await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
await fs.writeFile(OUT_FILE, JSON.stringify(docs, null, 2));

console.log(
  `✓ Generated component docs (${loaded}/${COMPONENT_IDS.length} components) → ${path.relative(APP_ROOT, OUT_FILE)}`,
);
