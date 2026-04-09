<!-- title -->

# poptab

<!-- /title -->

<!-- badges -->

[![NPM Package poptab](https://img.shields.io/npm/v/poptab.svg)](https://npmjs.com/package/poptab)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/kitschpatrol/poptab/actions/workflows/ci.yml/badge.svg)](https://github.com/kitschpatrol/poptab/actions/workflows/ci.yml)

<!-- /badges -->

<!-- short-description -->

**A CLI tool and library to clean up specific browser tabs.**

<!-- /short-description -->

## Overview

This is a trivial CLI tool to close browser tabs whose URLs contain a given URL string.

I use it in a few projects to clean up stale tabs during development sessions.

## Getting started

### Dependencies

The poptab CLI tool requires Node 20.19.0+. The exported APIs are ESM-only and share the Node 20.19.0+ requirement. Poptab is implemented in TypeScript and bundles type definitions.

This is a macOS-only tool. It can close tabs in Chromium, Chrome, or Safari.

On Linux and Windows, `poptab` is a no-op: the CLI prints a warning and exits cleanly (exit code `0`), and the `popTab()` library function resolves with `0` without throwing. This keeps `poptab` safe to call unconditionally from cross-platform `package.json` scripts. Pass `--strict` (or check `process.platform` yourself when using the library) if you need a hard failure on unsupported platforms.

### Installation

Invoke directly:

```sh
npx poptab
```

Or, install locally to access the CLI commands in a single project or to import the provided APIs:

```sh
npm install poptab
```

Or, install globally for access across your system:

```sh
npm install --global poptab
```

## Usage

By default, poptab will close tabs in an open Chromium browser containing `//localhost:`.

### Library

```ts
import { popTab } from 'poptab'

const closedTabs = await popTab({
  browser: 'chrome',
  urlContains: '127.0.0.1:',
})

console.log(`Closed ${closedTabs} tab(s)`)
```

### CLI

Note that for ease of cross-platform script chaining, the CLI always returns `0` unless `--strict` is passed. This lets you write npm scripts like `"poptab && vite"`

<!-- cli-help -->

#### Command: `poptab`

Close browser tabs containing a given URL string.

Usage:

```txt
poptab
```

| Option                   | Description                                                                                                                                                           | Type                               | Default          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------- |
| `--browser`<br>`-b`      | Browser to target for tab cleanup                                                                                                                                     | `"chromium"` `"chrome"` `"safari"` | `"chromium"`     |
| `--url-contains`<br>`-u` | String that tab URLs must contain to be closed                                                                                                                        | `string`                           | `"//localhost:"` |
| `--strict`<br>`-s`       | Exit with a non-zero status code on failure. Default is to report errors but exit cleanly so poptab can be safely chained in scripts (e.g. `poptab && next-command`). | `boolean`                          | `false`          |
| `--help`<br>`-h`         | Show help                                                                                                                                                             | `boolean`                          |                  |
| `--version`<br>`-v`      | Show version number                                                                                                                                                   | `boolean`                          |                  |

<!-- /cli-help -->

## See also

- [kill-tabs](https://www.npmjs.com/package/kill-tabs) (But note that this kills _processes_ instead of closing actual tabs.)

## Maintainers

[@kitschpatrol](https://github.com/kitschpatrol)

<!-- contributing -->

## Contributing

[Issues](https://github.com/kitschpatrol/poptab/issues) and pull requests are welcome.

<!-- /contributing -->

<!-- license -->

## License

[MIT](license.txt) © Eric Mika

<!-- /license -->
