import { defineConfig } from 'tsdown'

export default defineConfig([
	{
		dts: false,
		entry: 'src/bin/cli.ts',
		fixedExtension: false,
		outDir: 'dist/bin',
		platform: 'node',
	},
	{
		entry: 'src/lib/index.ts',
		minify: true,
		outDir: 'dist/lib',
		platform: 'neutral',
		tsconfig: 'tsconfig.build.json',
	},
])
