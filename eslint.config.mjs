import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["src/**/*.ts"], // Ensure it only checks TypeScript files inside src
  },
  {
    ignores: ["node_modules/", "dist/"], // Ignore node_modules and dist directories
  },
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
];
