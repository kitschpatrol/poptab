import { defineConfig } from 'tsdown'

export default defineConfig({
	attw: {
		profile: 'esm-only',
	},
	// Remove stale build output, including shared chunks, while preserving other assets.
	clean: ['dist/**/*.{js,js.map,d.ts,d.ts.map}'],
	dts: {
		entry: 'src/lib/index.ts',
	},
	entry: {
		'bin/cli': 'src/bin/cli.ts',
		'lib/index': 'src/lib/index.ts',
	},
	fixedExtension: false,
	format: 'esm',
	// Keep the library implementation readable wherever it is shared with the CLI.
	minify: false,
	outDir: 'dist',
	platform: 'node',
	publint: true,
	tsconfig: 'tsconfig.build.json',
})
