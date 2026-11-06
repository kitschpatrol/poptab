# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

(Node.js support requirements have sometimes increased in minor or patch releases.)

## [1.2.3] - 2026-11-01

### Maintenance

- Refresh shared-config, tsdown, Vitest, CLI-help tooling, and pnpm.
- Refresh CI/release actions, schedule dependency updates monthly, and exclude loopback URLs while allowing empty link-check inputs.
- Build before lint/fix and migrate contributor skill setup from the prepare script to pnpm-managed synchronization.
- Remove the separate development Node.js restriction and unused Knip and package-age exceptions.

## [1.2.2] - 2026-10-06

### Changed

- **Breaking:** Require Node.js `^24.16.0 || >=26.0.0` for the CLI and library, and align published Node.js types with version 24.

### Documentation

- Separate library and CLI installation guidance and generate documented Node.js requirements from package metadata.

### Maintenance

- Refresh shared-config, Homebrew/CLI-help tooling, Vitest, and pnpm, and update peer-dependency, build-script, and compiler configuration.
- Add weekly automated dependency-update pull requests.
- Synchronize contributor skills automatically during package preparation.
- Pin release and metadata actions to commit hashes and correct link-check diagnostic capture.

## [1.2.1] - 2026-09-21

### Added

- Add Homebrew CLI distribution through `kitschpatrol/tap/poptab`, integrated into releases with brewpub.

### Documentation

- Document Homebrew installation and a typical `poptab && vite dev` package-script example.

### Maintenance

- Update the yargs dependency requirement to `^18.2.0`.
- Consolidate CLI/library builds into shared `dist` output with stale-output cleanup, and rename the contributor cleanup script to `clean-deep`.
- Refresh development tools and CI, adopt pnpm 12 and Vitest 5, and require Node.js 26.8.2+ for development.

## [1.2.0] - 2026-08-28

### Added

- Allow `popTab()` to accept partial options, filling unspecified values from defaults.

### Changed

- **Breaking:** Treat `localhost`, `127.0.0.1`, `[::1]`, and `0.0.0.0` as interchangeable in URL filters by default; disable with `--no-equivalent-hosts` or `equivalentHosts: false`.
- **Breaking:** Add the required `equivalentHosts` boolean to exported `PopTabOptions`, requiring updates to explicitly typed option objects.
- **Breaking:** Raise the CLI and library's minimum Node.js requirement from 20.19 to 22.0.

### Fixed

- Escape double quotes and backslashes in URL filters to prevent malformed AppleScript.

### Documentation

- Document equivalent-host matching and its controls, update CLI help, and refresh package/license links.

### Maintenance

- Update runtime dependencies, including `@sindresorhus/is` 8, yargs 18.1, and Node.js 22 type declarations.
- Refresh development tools and pnpm, update publishing authentication, and require Node.js 26.7+ for development.
- Add scheduled repository/website link checks and validate release tags against the repository's default branch.

## [1.1.2] - 2026-07-16

### Maintenance

- Migrate to shared-config 8 and TypeScript 6, refresh type/build/test/CI dependencies, and require Node.js 24.16+ for development.
- Add VS Code lint/fix tasks and update compiler, lint, editor, and internal code conventions for the new toolchain.

## [1.1.1] - 2026-05-16

### Documentation

- Expand contribution guidance with issue-first pull requests and lint/README tooling instructions, and correct license links.

### Maintenance

- Refresh Node.js types and development dependencies, including shared-config, tsdown, Vitest, and CLI-help tooling.
- Migrate to pnpm 11 and `allowBuilds` approval settings, update CI actions, and use `pnpm ci` for CI installation.
- Pass npm publishing authentication directly through the publish command's environment.

## [1.1.0] - 2026-04-09

### Changed

- **Breaking:** Suppress cleanup status and error messages by default; add `--verbose` to display successes, skips, and errors.
- **Breaking:** Exit successfully after cleanup failures by default; add `--strict/-s` for nonzero exits on failures or unsupported platforms.
- Allow installation on Linux and Windows and skip tab cleanup there; `popTab()` resolves with `0` for valid options.

### Documentation

- Document silent defaults, strict/verbose controls, cross-platform script usage, and related browser-tab tools.

### Maintenance

- Update defu and Node.js type dependencies.
- Refresh development tooling, make repository cleanup portable, align library builds with Node.js `.js` exports, and accept release tags with or without `v`.
- Expand CI to Linux, macOS, and Windows and test non-macOS no-op behavior.

## [1.0.5] - 2026-04-06

### Maintenance

- Declare `@sindresorhus/is` and `defu` as runtime dependencies and update runtime requirements, including yargs 18 and nano-spawn.
- Add library unit tests and macOS CI running builds, linting, and tests; update release and metadata workflows.
- Add publint and Are the Types Wrong checks to builds and declare the package side-effect-free.
- Refresh development tools and pnpm, migrate to shared-config 7, and require Node.js 22.18+ for development.

## [1.0.4] - 2025-12-08

### Maintenance

- Refresh Node.js/yargs type dependencies and put type declarations first in package export conditions.
- Refresh development tools and pnpm, and correct shared-config hoisting by moving its rules into workspace configuration.

## [1.0.3] - 2025-11-05

### Maintenance

- Configure tsdown to emit `dist/bin/cli.js`, align npm's executable mapping, and update CLI-help tooling.

## [1.0.2] - 2025-11-04

### Fixed

- Add a Node.js shebang to the CLI and point npm's executable mapping at tsdown's `.mjs` output.

### Documentation

- Update the README's generated CLI reference with the corrected substring-filter description.

### Maintenance

- Replace pkgroll with tsdown for CLI and library builds.
- Update runtime dependencies, including nano-spawn 2 and Node.js/yargs type declarations.
- Refresh development tools and pnpm, add explicit CLI-help generation, and update token-based npm publishing configuration.

## [1.0.1] - 2025-09-08

### Changed

- **Breaking:** Restrict npm package installation to macOS through `os: ["darwin"]` metadata.

### Documentation

- Clarify that `--url-contains` matches a string contained in tab URLs.

### Maintenance

- Update shared-config and migrate lint/fix scripts from `kpi` to `ksc`.

## [1.0.0] - 2025-09-07

### Added

- Close tabs across Chromium, Chrome, or Safari windows on macOS using URL substring filters, defaulting to Chromium tabs containing `//localhost:`.
- Provide the npm-distributed `poptab` CLI with `--browser/-b`, `--url-contains/-u`, help/version options, closure-count messages, and nonzero exits on cleanup errors.
- Export `popTab()`, `PopTabOptions`, and `POP_TAB_OPTIONS_DEFAULTS` as an ESM library with TypeScript declarations; return the closed-tab count and require Node.js 20.19+.

### Documentation

- Add npx and local/global npm installation instructions, a CLI option reference, and a library usage example.

### Maintenance

- Establish TypeScript builds, shared linting and formatting, and automated release and repository-metadata workflows.

[1.0.0]: https://github.com/kitschpatrol/poptab/releases/tag/v1.0.0
[1.0.1]: https://github.com/kitschpatrol/poptab/compare/v1.0.0...v1.0.1
[1.0.2]: https://github.com/kitschpatrol/poptab/compare/v1.0.1...v1.0.2
[1.0.3]: https://github.com/kitschpatrol/poptab/compare/v1.0.2...v1.0.3
[1.0.4]: https://github.com/kitschpatrol/poptab/compare/v1.0.3...v1.0.4
[1.0.5]: https://github.com/kitschpatrol/poptab/compare/v1.0.4...v1.0.5
[1.1.0]: https://github.com/kitschpatrol/poptab/compare/v1.0.5...v1.1.0
[1.1.1]: https://github.com/kitschpatrol/poptab/compare/v1.1.0...v1.1.1
[1.1.2]: https://github.com/kitschpatrol/poptab/compare/v1.1.1...v1.1.2
[1.2.0]: https://github.com/kitschpatrol/poptab/compare/v1.1.2...v1.2.0
[1.2.1]: https://github.com/kitschpatrol/poptab/compare/v1.2.0...v1.2.1
[1.2.2]: https://github.com/kitschpatrol/poptab/compare/v1.2.1...v1.2.2
[1.2.3]: https://github.com/kitschpatrol/poptab/compare/v1.2.2...v1.2.3
