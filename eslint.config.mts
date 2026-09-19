import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"
import { defineConfig } from "eslint/config"

export default defineConfig([
  // -----------------------------
  // BASE CONFIG FOR TS + JS FILES
  // -----------------------------
  {
    files: ["**/*.{ts,mts,cts,js,mjs,cjs}"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      },
    },

    // ENV equivalent
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: true,
    },

    ignores: [".eslintrc.js", "_backup", "k8s", "_tests_old"],
  },

  // -----------------------------
  // EXTENDS (converted to flat config)
  // -----------------------------
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,

  // -----------------------------
  // CUSTOM RULES
  // -----------------------------
  {
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // semi rule in flat config style
      "semi": ["error", "never", { beforeStatementContinuationChars: "always" }],
    },
  },
])
