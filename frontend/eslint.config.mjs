import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored third-party UI (ReUI + 21st.dev) — kept as-is from source,
    // not our code to lint or maintain.
    "components/reui/**",
    "components/blocks/**",
  ]),
  {
    rules: {
      // react-hooks v6's set-state-in-effect flags every synchronous setState
      // in an effect as an error, but it can't distinguish real cascading-render
      // bugs from the standard, endorsed patterns we use: hydration mount flags,
      // localStorage restore, fetch-on-mount, and resetting local state when a
      // prop changes. Keep it as a visible warning so genuine misuse still shows
      // up in review, without failing the lint run on false positives.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
