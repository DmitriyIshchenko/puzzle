import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: ["**/*.config.js"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...compat.extends("airbnb-base", "airbnb-typescript/base"),
  eslintConfigPrettier,
  {
    rules: {
      "no-console": "error",
      "max-lines-per-function": ["error", 40],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
    },
  },
);

// export default [
//   {
//     languageOptions: {
//       globals: globals.browser,
//       parserOptions: { project: "./tsconfig.json" },
//     },
//     ignores: ["**/*.config.js"],
//   },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   ...compat.extends("airbnb-base", "airbnb-typescript/base"),
//   eslintConfigPrettier,
//   {
//     rules: {
//       "no-console": "error",
//       "max-lines-per-function": ["error", 40],
//     },
//   },
// ];

// @ts-check
