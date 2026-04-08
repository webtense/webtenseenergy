import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional ignores for legacy and test files:
    "OLD/**",
    "docs/**",
    "scripts/**",
    "*.md",
    "*.txt",
    "*.xml",
    "*.zip",
    "*.log",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "tsconfig.tsbuildinfo",
    ".git/",
    ".gitignore",
    ".DS_Store",
    "Thumbs.db",
    // Env files but keep example
    "!*.env.example",
    ".env*",
  ]),
]);

export default eslintConfig;
