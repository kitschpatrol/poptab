/* eslint-disable ts/no-explicit-any */

// @case-police-ignore AppleScript

import spawn from 'nano-spawn'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POP_TAB_OPTIONS_DEFAULTS, popTab } from '../../src/lib/index.js'

vi.mock('nano-spawn', () => ({
	default: vi.fn(),
}))

const mockSpawn = vi.mocked(spawn)

describe('popTab', () => {
	const originalPlatform = process.platform

	beforeEach(() => {
		vi.resetAllMocks()
		// Ensure tests behave as if on macOS regardless of CI platform
		Object.defineProperty(process, 'platform', { value: 'darwin' })

		mockSpawn.mockResolvedValue({ stdout: '0' } as any)
	})

	afterEach(() => {
		Object.defineProperty(process, 'platform', { value: originalPlatform })
	})

	describe('default options', () => {
		it('targets Chromium with //localhost: by default', async () => {
			mockSpawn.mockResolvedValue({ stdout: '3' } as any)

			const count = await popTab()

			expect(mockSpawn).toHaveBeenCalledExactlyOnceWith('osascript', ['-e', expect.any(String)])

			// @ts-expect-error - optional chaining
			const appleScript = String(mockSpawn.mock.calls[0]?.[1]?.[1])
			expect(appleScript).toContain('tell application "Chromium"')
			expect(appleScript).toContain('//localhost:')
			expect(count).toBe(3)
		})

		it('exports expected default values', () => {
			expect(POP_TAB_OPTIONS_DEFAULTS).toStrictEqual({
				browser: 'chromium',
				equivalentHosts: true,
				urlContains: '//localhost:',
			})
		})
	})

	describe('browser targeting', () => {
		it('targets Google Chrome', async () => {
			mockSpawn.mockResolvedValue({ stdout: '1' } as any)
			await popTab({ browser: 'chrome', urlContains: '//localhost:' })

			// @ts-expect-error - optional chaining
			const appleScript = String(mockSpawn.mock.calls[0]?.[1]?.[1])
			expect(appleScript).toContain('tell application "Google Chrome"')
		})

		it('targets Safari', async () => {
			mockSpawn.mockResolvedValue({ stdout: '2' } as any)
			await popTab({ browser: 'safari', urlContains: '//localhost:' })

			// @ts-expect-error - optional chaining
			const appleScript = String(mockSpawn.mock.calls[0]?.[1]?.[1])
			expect(appleScript).toContain('tell application "Safari"')
		})
	})

	describe('URL matching', () => {
		it('includes custom URL pattern in AppleScript', async () => {
			mockSpawn.mockResolvedValue({ stdout: '1' } as any)
			await popTab({ browser: 'chromium', urlContains: 'example.com:3000' })

			// @ts-expect-error - optional chaining
			const appleScript = String(mockSpawn.mock.calls[0]?.[1]?.[1])
			expect(appleScript).toContain('example.com:3000')
		})

		it('escapes double quotes in the URL pattern', async () => {
			await popTab({ urlContains: 'example.com/"quoted"' })

			// @ts-expect-error - optional chaining
			const appleScript = String(mockSpawn.mock.calls[0]?.[1]?.[1])
			expect(appleScript).toContain(String.raw`example.com/\"quoted\"`)
		})
	})

	describe('equivalent hosts', () => {
		it('expands localhost to all loopback hosts by default', async () => {
			await popTab()

			// @ts-expect-error - optional chaining
			const appleScript = String(mockSpawn.mock.calls[0]?.[1]?.[1])
			expect(appleScript).toContain('(URL of t contains "//localhost:")')
			expect(appleScript).toContain('(URL of t contains "//127.0.0.1:")')
			expect(appleScript).toContain('(URL of t contains "//[::1]:")')
			expect(appleScript).toContain('(URL of t contains "//0.0.0.0:")')
		})

		it('expands 127.0.0.1 to all loopback hosts', async () => {
			await popTab({ urlContains: '127.0.0.1:5173' })

			// @ts-expect-error - optional chaining
			const appleScript = String(mockSpawn.mock.calls[0]?.[1]?.[1])
			expect(appleScript).toContain('localhost:5173')
			expect(appleScript).toContain('127.0.0.1:5173')
			expect(appleScript).toContain('[::1]:5173')
			expect(appleScript).toContain('0.0.0.0:5173')
		})

		it('matches only the given string when equivalentHosts is false', async () => {
			await popTab({ equivalentHosts: false, urlContains: '//localhost:' })

			// @ts-expect-error - optional chaining
			const appleScript = String(mockSpawn.mock.calls[0]?.[1]?.[1])
			expect(appleScript).toContain('//localhost:')
			expect(appleScript).not.toContain('127.0.0.1')
			expect(appleScript).not.toContain('[::1]')
			expect(appleScript).not.toContain('0.0.0.0')
		})

		it('does not expand non-loopback hosts', async () => {
			await popTab({ urlContains: 'example.com:3000' })

			// @ts-expect-error - optional chaining
			const appleScript = String(mockSpawn.mock.calls[0]?.[1]?.[1])
			expect(appleScript).toContain('example.com:3000')
			expect(appleScript).not.toContain('localhost')
			expect(appleScript).not.toContain('127.0.0.1')
		})
	})

	describe('return values', () => {
		it('returns 0 when no tabs match', async () => {
			mockSpawn.mockResolvedValue({ stdout: '0' } as any)
			const count = await popTab()
			expect(count).toBe(0)
		})

		it('parses multi-digit tab counts', async () => {
			mockSpawn.mockResolvedValue({ stdout: '42' } as any)
			const count = await popTab()
			expect(count).toBe(42)
		})
	})

	describe('validation', () => {
		it('returns 0 without spawning on non-macOS platforms', async () => {
			Object.defineProperty(process, 'platform', { value: 'linux' })
			await expect(popTab()).resolves.toBe(0)
			expect(mockSpawn).not.toHaveBeenCalled()
		})

		it('returns 0 without spawning on Windows', async () => {
			Object.defineProperty(process, 'platform', { value: 'win32' })
			await expect(popTab()).resolves.toBe(0)
			expect(mockSpawn).not.toHaveBeenCalled()
		})

		it('throws on empty urlContains', async () => {
			await expect(popTab({ browser: 'chromium', urlContains: '' })).rejects.toThrow()
			expect(mockSpawn).not.toHaveBeenCalled()
		})

		it('throws on whitespace-only urlContains', async () => {
			await expect(popTab({ browser: 'chromium', urlContains: ' '.repeat(3) })).rejects.toThrow()
			expect(mockSpawn).not.toHaveBeenCalled()
		})
	})

	describe('error handling', () => {
		it('wraps spawn errors with context', async () => {
			const spawnError = new Error('osascript failed')
			mockSpawn.mockRejectedValue(spawnError)

			let thrownError: unknown

			try {
				await popTab()
			} catch (error) {
				thrownError = error
			}

			expect(thrownError).toBeInstanceOf(Error)
			expect((thrownError as Error).message).toBe('Error popping tabs')
			expect((thrownError as Error).cause).toBe(spawnError)
		})
	})
})
