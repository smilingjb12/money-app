import path from "node:path";
import { fileURLToPath } from "node:url";

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const tsconfigPath = "./tsconfig.json";
const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

const typeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      ...config.languageOptions?.parserOptions,
      project: [tsconfigPath],
      projectService: true,
      tsconfigRootDir,
    },
  },
}));

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...typeCheckedConfigs,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "react-hooks/incompatible-library": "off",
      "react-hooks/unsupported-syntax": "off",
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "convex/_generated/**",
      "tsconfig.tsbuildinfo",
    ],
  },
];

export default config;
