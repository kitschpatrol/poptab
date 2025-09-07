<!-- title -->

<!-- banner -->

<!-- badges -->

<!-- short-description -->

## Overview

This is a trivial CLI tool to close browser tabs whose URLs contain a given URL string.

I use it in a few projects to clean up stale tabs during development sessions.

## Getting started

### Dependencies

The poptab CLI tool requires Node 20.19.0+. The exported APIs are ESM-only and share the Node 20.19.0+ requirement. Poptab is implemented in TypeScript and bundles type definitions.

This is a macOS-only tool. It can close tabs in Chromium, Chrome, or Safari.

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

<!-- cli-commands -->

## Maintainers

_List maintainer(s) for a repository, along with one way of contacting them (e.g. GitHub link or email)._

<!-- contributing -->

<!-- license -->
