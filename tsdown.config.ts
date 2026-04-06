import { defineConfig } from 'tsdown'

export default defineConfig([
	{
		dts: false,
		entry: 'src/bin/cli.ts',
		fixedExtension: false,
		minify: true,
		outDir: 'dist/bin',
		platform: 'node',
	},
	{
		attw: {
			profile: 'esm-only',
		},
		entry: 'src/lib/index.ts',
		outDir: 'dist/lib',
		platform: 'neutral',
		publint: true,
		tsconfig: 'tsconfig.build.json',
	},
])
