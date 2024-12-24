### @acme/ui component library

<hr/>

A collection of samples of my work from the last couple years.

- various **custom UI components** based on **radix** primitives
- a **form system** with **inputs** & **field** wrappers using **react-hook-form** and **zod** (some based on adobe's **react-aria-components**)
- a **data table** system wrapping **tanstack table**
- **alert** & **toast/snackbar** notifications systems inlc. components & state/context hooks
- an **`<Icon>`** wrapper component using the **react-feather** icons library
- more! :)

[acme-ui.vercel.app](https://acme-ui.vercel.app/)

<hr/>

written with React, TypeScript, TailwindCSS, & Storybook workshop for component development

a Tsup bundler setup shows how to export this components lib as a package _(lib not currently published - this is a demo repo)_

<hr/>

#### usage notes

##### linking locally

###### prod mode:

- in `package.json` add the path to the project in the dependencies:

`"@acme/ui": "file:../acme"`

_^ this will pull the components lib from the /dist, so it requires building the library first (must rebuild after making changes)_

###### dev mode:

- use `npm link`

  --- to link ---

  UI project: `npm link`

  end project: `npm link @acme/ui`

  --- to unlink ---

  end project: `npm unlink @acme/ui`

  UI project: `npm unlink`

  _^ this uses the components in dev mode, the visual result in dev may differ from the end/production result; will likely require browser refresh after changes_

#### CSS config

_if you've setup TW before you prob already know this_

on the end project, in `tailwind.config.ts`

`const tailwindPreset = require('@acme/ui/tailwind-config')`
or
`import * as tailwindPreset from '@acme/ui/tailwind-config'`

then add it as a preset inside the config object
`presets: [tailwindPreset]`

_^ this imports the tailwind.config.ts from the UI library and merges it with the TW config of the project, so that the color palette and theme configuration are included in the tailwind build_

in the **`content`** array of the config, add:
`'./node_modules/@acme/ui/dist/**/*.{cjs,css,cts,ts,js}'`

_^ this is so that Tailwind classes used by the UI components are included in the css bundle of this project_

<hr/>

#### a known issue when publishing a client components lib

so far the popular bundlers do not support this functionality:

they cannot preserve the `'use client'` directive individually when exporting Client Components

in the tsup config example, banner adds `'use client'` to the top of the bundled .js and .cjs files in the dist

info:

https://github.com/egoist/tsup/issues/835

https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#advice-for-library-authors
