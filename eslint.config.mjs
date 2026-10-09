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
    "dist/**",
    ".*-check/**",
    ".wrangler/**",
    "work/**",
    "public/pdf.worker.min.mjs",
    "public/vendor/**",
    // Upstream bidi tables and fontkit generator runtime retain their licenses.
    "lib/vendor/**",
    // Transpiled test fixtures; lint their TypeScript sources instead.
    "lib/.verify-*.mjs",
  ]),
  {
    files: ["components/browser-image.tsx"],
    rules: {
      // This browser-only wrapper renders private data/blob URLs and local
      // assets. Server optimization would violate the document privacy model.
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["components/ui/**/*.{ts,tsx}", "hooks/use-mobile.ts"],
    rules: {
      // These files are vendored verbatim from shadcn@4.17.0. Keep the
      // registry source intact while applying the stricter rules to Site code.
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;


