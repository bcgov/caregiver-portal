# Design tokens

How the Caregiver Portal uses the B.C. Design System tokens
([`@bcgov/design-tokens`](https://www.npmjs.com/package/@bcgov/design-tokens), currently v3.2.0).

All portal styles live in `caregiver-portal/src/DesignTokens.css` and
`caregiver-portal/src/components/Button.css`. The first line of `DesignTokens.css` imports
`@bcgov/design-tokens/css/variables.css`, so every token is available as a CSS custom property.

## Background

- A token is a named, reusable style value (colour, type, spacing, elevation). The tokens are the
  single source of truth for the design system's look and feel.
- **Naming:** `System.Usage.Property.Modifier.Component.Variant`. In CSS the dots become hyphens:
  `surface.color.primary.button.default` is `--surface-color-primary-button-default`.
- **Categories:**
  - `surface`: fills, borders, shadows, overlay
  - `support`: status colours (info, success, warning, danger)
  - `layout`: padding, margin, radius, border width
  - `typography`
  - `icons`
  - `theme`: raw palette scales (gold, blue, gray)
- **Principles:** use names, not raw values. Names describe purpose, not appearance. Build
  components from tokens. Read the release notes before upgrading a major version.
- We use the unprefixed CSS build. A prefixed (`--bcds-*`) build and a JS export also ship in the
  package, but we don't use them.

## Rules for CSS

1. **Reference tokens with `var()`.** `color: var(--typography-color-primary)`. A bare name
   (`color: --typography-color-primary`) is invalid CSS and the whole declaration is silently
   dropped.
2. **Choose by purpose, then state.**
   - Text: `--typography-color-*`
   - Icons: `--icons-color-*`
   - Fills and borders: `--surface-color-*`
   - Status: `--support-*`
   - `--theme-*` scales only when nothing semantic fits.
3. **Status messages pair a surface with a border.** For example
   `--support-surface-color-danger` with `--support-border-color-danger`, and
   `--typography-color-danger` for text. The same pattern applies to success, warning and info.
4. **Spacing.** `--layout-padding-*` for padding and `--layout-margin-*` for margin and `gap`.
   The scale is hair (2px), xsmall (4px), small (8px), medium (16px), large (24px),
   xlarge (32px). Do not use `px` or `rem` spacing literals. Round to the nearest step.
5. **Radius and borders.** `--layout-border-radius-*` and `--layout-border-width-*`. A border
   shorthand always needs a style keyword:
   `border: var(--layout-border-width-small) solid var(--surface-color-border-medium)`.
   A width and colour without `solid` draws nothing.
6. **Typography.**
   - Set the family once, on `body`. Do not add `font-family` to individual rules.
     (`button, input, select, textarea { font: inherit }` makes form controls follow it.)
   - Sizes: `--typography-font-size-*`. Weights: only
     `--typography-font-weights-regular` (400) and `--typography-font-weights-bold` (700).
     Line-heights: `--typography-line-heights-*`.
   - Where one rule sets size, weight and line-height together, use a composite token:
     `font: var(--typography-bold-h5)`. The shorthand resets everything, so put it first in the
     rule and don't add `font-size` or `font-weight` after it. Never use a composite token as the
     value of a single property.
7. **Shadows.** `--surface-shadow-small|medium|large`. Cards and menus use medium, modals use
   large.
8. **Icons.** Size with `--icons-size-*` (medium, 20px, is the default) and colour with
   `--icons-color-*`.
9. **Buttons.** `Button.css` uses `surface-color-{primary|secondary|tertiary}-button-{default|hover|disabled}`
   and `primary-danger-button-*`. Every button renders as `btn btn-<variant>`, so variants only
   override what differs from `.btn`.
10. **No fallbacks.** The tokens are imported globally, so write `var(--x)`, not
    `var(--x, #hex)`. The one exception is `--cgr-banner-height` (see below).
11. **Never invent token names.** Check `node_modules/@bcgov/design-tokens/css/variables.css`
    or the [token glossary](https://www2.gov.bc.ca/gov/content/digital/design-system/foundations/design-tokens/glossary).
    A misspelled `var()` fails silently.
12. **Project custom properties** get the `--cgr-` prefix so they can't be mistaken for design
    system tokens. The only one today is `--cgr-banner-height`, set at runtime by
    `EnvironmentBanner.jsx`. Never redefine a BCDS name.
13. **Check contrast** when mixing tokens across categories, and keep a `prefers-reduced-motion`
    override on animations.

## In JSX

- Don't use hex colours or named colours in `style={{}}` props or SVG attributes. Move the style
  into a CSS class that uses `var()`, or, for SVG fills, a class with `fill: var(--…)`.
- Lucide icons draw in `currentColor`, so set the colour with CSS instead of a `color="…"` prop.
- If a value genuinely must live in JavaScript, import the JS tokens:
  `import * as tokens from "@bcgov/design-tokens/js"`.

## Quick lookup

| Need | Token |
|---|---|
| Body text | `--typography-color-primary` / `--typography-regular-body` |
| Secondary text | `--typography-color-secondary` |
| Link | `--typography-color-link` |
| Text on dark | `--typography-color-primary-invert` |
| Muted icon | `--icons-color-secondary` (`--icons-color-disabled` for inactive only) |
| Danger accent | `--support-border-color-danger` / `--icons-color-danger` |
| Success accent | `--support-border-color-success` / `--icons-color-success` |
| Page background | `--surface-color-background-light-gray` |
| Hover row | `--surface-color-menus-hover` |
| Border | `--surface-color-border-default` (light), `-medium`, `-dark` |
| Card shadow | `--surface-shadow-medium` |
| Modal overlay | `--surface-color-overlay-default` |
| Brand blue / gold | `--theme-primary-blue` / `--theme-primary-gold` |

## Linting

```bash
npm run lint:css      # Stylelint, run from caregiver-portal/caregiver-portal
npm run lint          # ESLint, includes a rule against hex colours in JS/JSX
```

`lint:css` is not enforced in CI, so run it before opening a pull request. It should finish with
no errors and no warnings. Configuration is in `stylelint.config.js`. It flags:

- hex colours, named colours, and `rgb()` / `rgba()` / `hsl()` / `hsla()`
- unknown custom properties (misspelled or legacy token names)
- literal `font-family`, `font-size`, `font-weight`, `line-height` and `box-shadow` values
- border shorthands without a style keyword
- `px` / `rem` in spacing and radius properties (as warnings)

### Documented exceptions

When something has no token, suppress the rule on that line with a reason:

```css
/* stylelint-disable-next-line color-no-hex -- decorative gradient end, no BCDS token */
```

Current exceptions in `DesignTokens.css`:

| Where | Why |
|---|---|
| `.welcome-card-container` `rgba(…)` background | primary blue at 70%, no token |
| `.success-progress-bar` `rgba(…)` track, and the `drop-shadow(…)` glows on `.submission-spinner` and `.success-icon` | decorative, no token |
| `.success-progress-fill` `#43AA56` gradient end | decorative, no token |
| `.breadcrumb-bottom` `box-shadow` | upward shadow, the tokens only cast downward |
| `.application-step-icon--nudge` `padding-left: 1px` | optical alignment |
| `.declaration-text` `margin-top: 13px` | hand-tuned alignment |
| `.submission-modal` `padding` and `border-radius` | modal-specific, no token |
| `EnvironmentBanner.jsx` | dev and test only, excluded from the ESLint hex rule |

## Known gaps

- 14 heading and large-body rules still set size, weight and line-height as separate tokens.
  Their composite tokens (`--typography-bold-h1`, `-h2`, `-h4`, `-h5`, `-large-body`) carry
  different line-heights, so they are waiting for design to confirm the change.
- A few `padding` rules at 60px and 64px use `--layout-margin-huge`, because the padding scale
  stops at 32px.
- Ten inline `style={{}}` objects remain in JSX (layout only, no colours).

## Pull request checklist

- [ ] No hex or named colours, and no `px` spacing literals
- [ ] `npm run lint:css` passes
- [ ] Tokens are wrapped in `var()` and exist in `variables.css`
- [ ] New borders include a style keyword
- [ ] Anything without a token has a suppress comment with a reason
