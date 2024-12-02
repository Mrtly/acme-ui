import { defineConfig } from 'tsup'

export default defineConfig(() => ({
	// tsconfig: 'tsconfig.json',
	entry: ['src/index.ts'], //signle entry but can be more (?)
	format: ['esm', 'cjs'],
	dts: true, //exports types (.d.ts)
	banner: {
		js: '"use client"', //"use client" is added to the top of the index.js/cjs in the /dist
	},
	minify: true,
	clean: true,
	splitting: false, //cannot use splitting with the banner option
	treeshake: false, //cannot use treeshake with the banner option
	external: ['react', 'react-dom'],
	onSuccess: 'cp -a ./tailwind.config.ts dist', //copy twconfig into /dist
}))

// https://tsup.egoist.dev/
// https://github.com/egoist/tsup/issues/835 (thread about "use client")
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#advice-for-library-authors
