import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {any} */
const eslintConfig = defineConfig([
  globalIgnores([
    "**/.next",
    "**/.open-next",
    "!**/.storybook",
    "**/.pnpm-store",
    "**/pnpm-lock.yaml",
    "**/node_modules",
    "**/dist",
    "**/next-env.d.ts",
  ]),
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    extends: ["js/recommended"],
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    rules: {
      "consistent-return": "error",
      eqeqeq: "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-else-return": "error",
      "no-param-reassign": ["error", { props: true }],
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-use-before-define": "error",
      "object-shorthand": "error",
      "prefer-const": "error",
      semi: "error",
      strict: ["error", "global"],
    },
  },
  // CLI — allow console.log for CLI output
  {
    files: ["libs/cli/**/*.{js,mjs,cjs,ts}"],
    rules: {
      "no-console": "off",
    },
  },
  // React
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react,
    },
    rules: {
      "react/jsx-sort-props": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],
    },
  },
  // React Hooks
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // TypeScript
  tseslint.configs.recommended,
  tseslint.config({
    rules: {
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "always" },
      ],
      "@typescript-eslint/no-unused-vars": "error",
    },
  }),
  {
    files: ["./frontend/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  // Perfectionist
  perfectionist.configs["recommended-natural"],
  {
    rules: {
      "perfectionist/sort-exports": [
        "error",
        {
          order: "asc",
          partitionByNewLine: true,
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          groups: [
            "side-effect",
            "side-effect-style",
            "type",
            ["value-builtin", "value-external"],
            "type-internal",
            "value-internal",
            ["type-parent", "type-sibling", "type-index"],
            ["value-parent", "value-sibling", "value-index"],
            "unknown",
          ],
        },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        {
          order: "asc",
          partitionByNewLine: true,
        },
      ],
      "perfectionist/sort-jsx-props": [
        "error",
        {
          customGroups: [
            { elementNamePattern: "^key$", groupName: "key" },
            { elementNamePattern: "^id$", groupName: "id" },
            { elementNamePattern: "^className$", groupName: "classname" },
            { elementNamePattern: "^style$", groupName: "style" },
            { elementNamePattern: "^on.+", groupName: "callback" },
            { elementNamePattern: "^ref$", groupName: "ref" },
          ],
          groups: [
            "key",
            "id",
            "classname",
            "style",
            "unknown",
            "callback",
            "ref",
          ],
        },
      ],
      "perfectionist/sort-modules": [
        "error",
        {
          order: "asc",
          partitionByNewLine: true,
        },
      ],
      "perfectionist/sort-union-types": [
        "error",
        {
          groups: [
            "conditional",
            "function",
            "import",
            "intersection",
            "keyword",
            "literal",
            "named",
            "object",
            "operator",
            "tuple",
            "union",
            "nullish",
          ],
          order: "asc",
        },
      ],
    },
  },
]);

export default eslintConfig;
