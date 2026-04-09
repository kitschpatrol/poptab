// @case-police-ignore appleScript

import { assert } from '@sindresorhus/is'
import { defu } from 'defu'
import spawn from 'nano-spawn'

export const POP_TAB_OPTIONS_DEFAULTS: PopTabOptions = {
	browser: 'chromium',
	urlContains: '//localhost:',
}

export type PopTabOptions = {
	browser: 'chrome' | 'chromium' | 'safari'
	urlContains: string
}

/**
 * Pop stale tabs from a browser.
 *
 * Firefox doesn't support enough AppleScript to work with this approach.
 *
 * This function is a no-op on non-macOS platforms: it resolves with `0`
 * without throwing, so cross-platform scripts can call it unconditionally.
 * Callers who need strict behavior should check `process.platform` directly.
 * @param options - The options to use for the pop tab operation.
 * @returns The number of stale tabs popped. Always `0` on non-macOS platforms.
 * @throws {Error} If the AppleScript invocation fails.
 */
export async function popTab(options?: PopTabOptions): Promise<number> {
	const { browser, urlContains } = defu(options, POP_TAB_OPTIONS_DEFAULTS)

	assert.nonEmptyStringAndNotWhitespace(urlContains)
	assert.all((value) => value === 'chromium' || value === 'chrome' || value === 'safari', browser)

	if (process.platform !== 'darwin') {
		return 0
	}

	const appleScriptBrowserNameMap = {
		chrome: 'Google Chrome',
		chromium: 'Chromium',
		safari: 'Safari',
	}

	const appleScriptBrowserName = appleScriptBrowserNameMap[browser]

	const appleScript = `
    tell application "${appleScriptBrowserName}"
      set closedCount to 0
      set windowList to every window
      repeat with win in windowList
        set tabList to every tab of win
        repeat with t in tabList
          if (URL of t contains "${urlContains}") then
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
		const closedTabs = Number.parseInt(stdout, 10)
		return closedTabs
	} catch (error) {
		throw new Error(`Error popping tabs`, { cause: error })
	}
}
