import { fileURLToPath } from 'node:url';

// Absolute path: the plugin resolves relative paths from the working directory.
const tokens = fileURLToPath(
  new URL('./node_modules/@bcgov/design-tokens/css/variables.css', import.meta.url)
);

/** @type {import('stylelint').Config} */
export default {
  plugins: ['stylelint-value-no-unknown-custom-properties'],
  rules: {
    // Colours must come from tokens
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],

    // Only real BCDS tokens. --cgr-banner-height is set at runtime by EnvironmentBanner.jsx.
    'csstools/value-no-unknown-custom-properties': [
      true,
      { importFrom: [tokens, { customProperties: { '--cgr-banner-height': '0px' } }] },
    ],

    // Typography must use tokens
    'declaration-property-value-allowed-list': {
      'font-family': ['/^var\\(--typography-font-families-/'],
      'font-size': ['/^var\\(--typography-font-size-/', 'inherit'],
      'font-weight': ['/^var\\(--typography-font-weights-/', 'inherit'],
      'line-height': ['/^var\\(--typography-line-heights-/'],
      font: ['/^var\\(--typography-(regular|bold|italic)-/', 'inherit'],
      'box-shadow': ['/^var\\(--surface-shadow-/', 'none'],
    },

    // A border width without a style draws nothing (the bug that hid input borders)
    'declaration-property-value-disallowed-list': {
      '/^border(-(top|right|bottom|left))?$/': [
        '/^var\\(--layout-border-width-[a-z]+\\)\\s+(?!solid|dashed|dotted|none)/',
        '/^\\d+px\\s+(?!solid|dashed|dotted|none)/',
      ],
    },

    // Spacing and radius: warning only (T5 commit 3 was skipped, so there is a baseline)
    'declaration-property-unit-disallowed-list': [
      {
        '/^(gap|row-gap|column-gap|padding.*|margin.*)$/': ['px', 'rem'],
        '/^border.*radius$/': ['px'],
      },
      { severity: 'warning', message: 'Use a --layout-* token (see docs/design-tokens.md)' },
    ],
  },
};