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

By default, `poptab` is silent: it prints nothing on success, failure, or unsupported platforms, and exits `0`. Pass `--verbose` to surface status messages, and `--strict` to fail hard with a non-zero exit code. This makes `poptab` safe to drop into cross-platform `package.json` scripts without cluttering output.

## Getting started

### Dependencies

The poptab CLI tool requires Node 20.19.0+. The exported APIs are ESM-only and share the Node 20.19.0+ requirement. Poptab is implemented in TypeScript and bundles type definitions.

It can close tabs in Chromium, Chrome, or Safari

The implementation relies on macOS-specific scripting capabilities. On Linux and Windows it is a no-op.

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

<!-- cli-help -->

#### Command: `poptab`

Close browser tabs containing a given URL string.

Usage:

```txt
poptab
```

| Option                   | Description                                                                                                                                         | Type                               | Default          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------- |
| `--browser`<br>`-b`      | Browser to target for tab cleanup                                                                                                                   | `"chromium"` `"chrome"` `"safari"` | `"chromium"`     |
| `--url-contains`<br>`-u` | String that tab URLs must contain to be closed                                                                                                      | `string`                           | `"//localhost:"` |
| `--strict`<br>`-s`       | Exit with a non-zero status code on failure. Default is to exit cleanly so poptab can be safely chained in scripts (e.g. `poptab && next-command`). | `boolean`                          | `false`          |
| `--verbose`              | Print status messages (successes, skips, and errors). Default is silent so poptab does not clutter script output.                                   | `boolean`                          | `false`          |
| `--help`<br>`-h`         | Show help                                                                                                                                           | `boolean`                          |                  |
| `--version`<br>`-v`      | Show version number                                                                                                                                 | `boolean`                          |                  |

<!-- /cli-help -->

## Implementation notes

Other projects of interest:

- [better-opn](https://github.com/michaellzc/better-opn/tree/master) AppleScript approach. Eponymous NPM package seems sketchy / abandoned.
- [kill-tabs](https://www.npmjs.com/package/kill-tabs) This kills the _processes_ instead of closing actual tabs.
- [open-in-browser-tab](https://www.npmjs.com/package/open-in-browser-tab) Pairs with a browser extension.

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
