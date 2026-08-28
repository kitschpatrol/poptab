// @case-police-ignore appleScript

import { assert } from '@sindresorhus/is'
import { defu } from 'defu'
import spawn from 'nano-spawn'

export const POP_TAB_OPTIONS_DEFAULTS: PopTabOptions = {
	browser: 'chromium',
	equivalentHosts: true,
	urlContains: '//localhost:',
}

export type PopTabOptions = {
	browser: 'chrome' | 'chromium' | 'safari'
	/**
	 * Treat loopback hosts (`localhost`, `127.0.0.1`, `[::1]`, `0.0.0.0`) as
	 * interchangeable when matching tab URLs.
	 */
	equivalentHosts: boolean
	urlContains: string
}

/**
 * Loopback hosts that all resolve to the local machine, in the forms they
 * appear in browser URLs.
 */
const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]', '0.0.0.0']

/**
 * Pop stale tabs from a browser.
 *
 * Firefox doesn't support enough AppleScript to work with this approach.
 *
 * This function is a no-op on non-macOS platforms: it resolves with `0` without
 * throwing, so cross-platform scripts can call it unconditionally. Callers who
 * need strict behavior should check `process.platform` directly.
 *
 * When `equivalentHosts` is enabled (the default) and `urlContains` includes a
 * loopback host, tabs matching any other loopback host are closed too — for
 * example `//localhost:` also matches `//127.0.0.1:`, `//[::1]:`, and
 * `//0.0.0.0:`.
 *
 * @param options - The options to use for the pop tab operation.
 *
 * @returns The number of stale tabs popped. Always `0` on non-macOS platforms.
 * @throws {Error} If the AppleScript invocation fails.
 */
export async function popTab(options?: Partial<PopTabOptions>): Promise<number> {
	const { browser, equivalentHosts, urlContains } = defu(options, POP_TAB_OPTIONS_DEFAULTS)

	assert.nonEmptyStringAndNotWhitespace(urlContains)
	assert.boolean(equivalentHosts)
	assert.all(
		(value) => typeof value === 'string' && ['chrome', 'chromium', 'safari'].includes(value),
		browser,
	)

	if (process.platform !== 'darwin') {
		return 0
	}

	const appleScriptBrowserNameMap = {
		chrome: 'Google Chrome',
		chromium: 'Chromium',
		safari: 'Safari',
	}

	const appleScriptBrowserName = appleScriptBrowserNameMap[browser]

	const urlVariants = equivalentHosts ? expandEquivalentHosts(urlContains) : [urlContains]
	const urlCondition = urlVariants
		.map((variant) => `(URL of t contains "${escapeAppleScriptString(variant)}")`)
		.join(' or ')

	const appleScript = `
    tell application "${appleScriptBrowserName}"
      set closedCount to 0
      set windowList to every window
      repeat with win in windowList
        set tabList to every tab of win
        repeat with t in tabList
          if ${urlCondition} then
            close t
            set closedCount to closedCount + 1
          end if
        end repeat
      end repeat
      return closedCount
    end tell
  `

	try {
		const { stdout } = await spawn('osascript', ['-e', appleScript])
		const closedTabs = Number(stdout)
		return closedTabs
	} catch (error) {
		throw new Error(`Error popping tabs`, { cause: error })
	}
}

/**
 * Escape a string for safe interpolation into a double-quoted AppleScript
 * string literal.
 */
function escapeAppleScriptString(value: string): string {
	return value.replaceAll('\\', String.raw`\\`).replaceAll('"', String.raw`\"`)
}

/**
 * Expand a match string containing a loopback host into one variant per
 * equivalent loopback host. Returns the string unchanged (as a single-element
 * array) if it doesn't reference a loopback host.
 */
function expandEquivalentHosts(urlContains: string): string[] {
	const matchedHost = LOOPBACK_HOSTS.find((host) => urlContains.includes(host))

	if (matchedHost === undefined) {
		return [urlContains]
	}

	return LOOPBACK_HOSTS.map((host) => urlContains.replaceAll(matchedHost, () => host))
}
