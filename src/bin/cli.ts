#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { version } from '../../package.json'
import { popTab, POP_TAB_OPTIONS_DEFAULTS, type PopTabOptions } from '../lib'

const yargsInstance = yargs(hideBin(process.argv))

await yargsInstance
	.scriptName('poptab')
	.command(
		'*',
		'Close browser tabs containing a given URL string.',
		(yargs) =>
			yargs
				.option('browser', {
					alias: 'b',
					choices: ['chromium', 'chrome', 'safari'] as const,
					default: POP_TAB_OPTIONS_DEFAULTS.browser,
					describe: 'Browser to target for tab cleanup',
					type: 'string',
				})
				.option('url-contains', {
					alias: 'u',
					default: POP_TAB_OPTIONS_DEFAULTS.urlContains,
					describe: 'String that tab URLs must contain to be closed',
					type: 'string',
				})
				.option('strict', {
					alias: 's',
					default: false,
					describe:
						'Exit with a non-zero status code on failure. Default is to exit cleanly so poptab can be safely chained in scripts (e.g. `poptab && next-command`).',
					type: 'boolean',
				})
				.option('verbose', {
					default: false,
					describe:
						'Print status messages (successes, skips, and errors). Default is silent so poptab does not clutter script output.',
					type: 'boolean',
				}),
		async ({ browser, strict, urlContains, verbose }) => {
			try {
				if (process.platform !== 'darwin') {
					if (verbose) {
						process.stderr.write(
							`poptab: skipping, only supported on macOS (platform: ${process.platform}).\n`,
						)
					}
					if (strict) {
						process.exitCode = 1
					}
					return
				}

				const options: PopTabOptions = {
					browser: browser as PopTabOptions['browser'],
					urlContains,
				}

				const closedCount = await popTab(options)

				if (verbose) {
					if (closedCount === 0) {
						process.stdout.write('No matching tabs found to close.\n')
					} else {
						process.stdout.write(
							`Successfully closed ${closedCount} tab${closedCount === 1 ? '' : 's'}.\n`,
						)
					}
				}
			} catch (error) {
				if (verbose) {
					process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`)
				}
				if (strict) {
					process.exitCode = 1
				}
			}
		},
	)
	.alias('h', 'help')
	.version(version)
	.alias('v', 'version')
	.help()
	.wrap(process.stdout.isTTY ? Math.min(120, yargsInstance.terminalWidth()) : 0)
	.parse()
