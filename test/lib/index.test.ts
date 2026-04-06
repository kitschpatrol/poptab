/* eslint-disable ts/no-explicit-any */
/* eslint-disable ts/no-unsafe-type-assertion */
/* eslint-disable ts/no-unsafe-argument */
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

			expect(mockSpawn).toHaveBeenCalledOnce()
			expect(mockSpawn).toHaveBeenCalledWith('osascript', ['-e', expect.any(String)])

			// @ts-expect-error - optional chaining
			const appleScript = String(mockSpawn.mock.calls[0]?.[1]?.[1])
			expect(appleScript).toContain('tell application "Chromium"')
			expect(appleScript).toContain('//localhost:')
			expect(count).toBe(3)
		})

		it('exports expected default values', () => {
			expect(POP_TAB_OPTIONS_DEFAULTS).toStrictEqual({
				browser: 'chromium',
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
		it('throws on non-macOS platforms', async () => {
			Object.defineProperty(process, 'platform', { value: 'linux' })
			await expect(popTab()).rejects.toThrow('only supported on macOS')
			expect(mockSpawn).not.toHaveBeenCalled()
		})

		it('throws on empty urlContains', async () => {
			await expect(popTab({ browser: 'chromium', urlContains: '' })).rejects.toThrow()
			expect(mockSpawn).not.toHaveBeenCalled()
		})

		it('throws on whitespace-only urlContains', async () => {
			await expect(popTab({ browser: 'chromium', urlContains: '   ' })).rejects.toThrow()
			expect(mockSpawn).not.toHaveBeenCalled()
		})
	})

	describe('error handling', () => {
		it('wraps spawn errors with context', async () => {
			const spawnError = new Error('osascript failed')
			mockSpawn.mockRejectedValue(spawnError)

			const error = await popTab().catch((error_: unknown) => error_)
			expect(error).toBeInstanceOf(Error)
			expect((error as Error).message).toBe('Error popping tabs')
			expect((error as Error).cause).toBe(spawnError)
		})
	})
})
