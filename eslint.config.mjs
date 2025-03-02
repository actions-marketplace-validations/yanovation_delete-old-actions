import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["src/**/*.ts"],
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
    ],
  },
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
];
