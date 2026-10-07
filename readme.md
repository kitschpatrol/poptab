<!-- title -->

# poptab

<!-- /title -->

<!-- badges -->

[![NPM Package poptab](https://img.shields.io/npm/v/poptab.svg)](https://www.npmjs.com/package/poptab)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/license/mit)
[![CI](https://github.com/kitschpatrol/poptab/actions/workflows/ci.yml/badge.svg)](https://github.com/kitschpatrol/poptab/actions/workflows/ci.yml)
[![Homebrew](https://img.shields.io/badge/Homebrew-kitschpatrol%2Ftap%2Fpoptab-FBB040?logo=homebrew&logoColor=white)](https://github.com/kitschpatrol/homebrew-tap/blob/HEAD/Formula/poptab.rb)

<!-- /badges -->

<!-- short-description -->

**CLI tool and library to clean up specific browser tabs.**

<!-- /short-description -->

## Overview

This is a trivial CLI tool to close browser tabs whose URLs contain a given URL string.

I use it in a few projects to clean up the stale tabs that tend to accumulate during development sessions.

By default, `poptab` is silent: it prints nothing on success, failure, or unsupported platforms, and exits `0`. Pass `--verbose` to surface status messages, and `--strict` to fail hard with a non-zero exit code. This makes `poptab` safe to drop into cross-platform `package.json` scripts without cluttering output.

## Getting started

### Dependencies

<!-- dependencies({ heading: false }) -->

- [Node.js](https://nodejs.org/) 24.16.0 or newer (specifically `^24.16.0 || >=26.0.0`)

<!-- /dependencies -->

The CLI tool and the exported APIs share this requirement. The exported APIs are ESM-only. Poptab is implemented in TypeScript and bundles type definitions.

It can close tabs in Chromium, Chrome, or Safari.

The implementation relies on macOS-specific scripting capabilities. On Linux and Windows it is a no-op.

### Installation

Pick the option that matches how you plan to use it.

#### As a library

Add it to your project to import the TypeScript API. This also puts the `poptab` CLI on your project's path:

```sh
npm install poptab
```

#### As a CLI tool

Run it once without installing:

```sh
npx poptab
```

Or install it globally with Homebrew:

```sh
brew install kitschpatrol/tap/poptab
```

Or install it globally with npm:

```sh
npm install --global poptab
```

## Usage

Most often, it ends up in a `package.json` script, e.g.:

```json
{
  "scripts": {
    "dev": "poptab && vite dev"
  }
}
```

By default, poptab will close tabs in an open Chromium browser containing `//localhost:`.

Also by default, loopback hosts are treated as interchangeable: if the URL string includes `localhost`, `127.0.0.1`, `[::1]`, or `0.0.0.0`, tabs matching any of the others are closed too. So the default match also catches tabs like `http://127.0.0.1:3000`. Pass `--no-equivalent-hosts` (or `equivalentHosts: false`) to match the URL string exactly.

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

<!-- cli-help({ heading: false, headingLevel: 3 }) -->

#### Command: `poptab`

Close browser tabs containing a given URL string.

Usage:

```txt
poptab
```

| Option                       | Description                                                                                                                                                         | Type                               | Default          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------- |
| `--browser`<br>`-b`          | Browser to target for tab cleanup                                                                                                                                   | `"chromium"` `"chrome"` `"safari"` | `"chromium"`     |
| `--url-contains`<br>`-u`     | String that tab URLs must contain to be closed                                                                                                                      | `string`                           | `"//localhost:"` |
| `--equivalent-hosts`<br>`-e` | Treat loopback hosts (localhost, 127.0.0.1, \[::1], 0.0.0.0) as interchangeable when matching tab URLs. Pass --no-equivalent-hosts to match the URL string exactly. | `boolean`                          | `true`           |
| `--strict`<br>`-s`           | Exit with a non-zero status code on failure. Default is to exit cleanly so poptab can be safely chained in scripts (e.g. `poptab && next-command`).                 | `boolean`                          | `false`          |
| `--verbose`                  | Print status messages (successes, skips, and errors). Default is silent so poptab does not clutter script output.                                                   | `boolean`                          | `false`          |
| `--help`<br>`-h`             | Show help                                                                                                                                                           | `boolean`                          |                  |
| `--version`<br>`-v`          | Show version number                                                                                                                                                 | `boolean`                          |                  |

<!-- /cli-help -->

## Implementation notes

Other projects of interest:

- [better-opn](https://github.com/michaellzc/better-opn/tree/master) AppleScript approach. Eponymous NPM package seems sketchy / abandoned.
- [kill-tabs](https://www.npmjs.com/package/kill-tabs) This kills the _processes_ instead of closing actual tabs.
- [open-in-browser-tab](https://www.npmjs.com/package/open-in-browser-tab) Pairs with a browser extension.

## Maintainers

[kitschpatrol](https://github.com/kitschpatrol)

<!-- contributing -->

## Contributing

[Issues](https://github.com/kitschpatrol/poptab/issues) are welcome and appreciated.

Please open an issue to discuss changes before submitting a pull request. Unsolicited PRs (especially AI-generated ones) are unlikely to be merged.

This repository uses [@kitschpatrol/shared-config](https://github.com/kitschpatrol/shared-config) (via its `ksc` CLI) for linting and formatting, plus [MDAT](https://github.com/kitschpatrol/mdat) for readme placeholder expansion.

<!-- /contributing -->

<!-- license -->

## License

[MIT](license.txt) © [Eric Mika](https://ericmika.com)

<!-- /license -->
