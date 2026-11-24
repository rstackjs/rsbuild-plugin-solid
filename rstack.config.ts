// Configuration guide: https://rstack.rs/config
import { definePlaywrightConfig } from '@rstest/playwright/config';
import { define } from 'rstack';

define.lib({
  dts: true,
  syntax: 'es2023',
});

define.test({
  extends: definePlaywrightConfig({}),
});

define.fmt({
  singleQuote: true,
  sortPackageJson: true,
});

define.staged({
  '*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}': ['rs lint', 'rs fmt'],
  '*.{json,md,mdx,css,scss,less,html,yml,yaml}': 'rs fmt',
});

define.lint(({ js, ts }) => [
  js.configs.recommended,
  ts.configs.recommendedTypeChecked,
]);
