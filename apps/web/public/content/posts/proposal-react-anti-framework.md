I am an outspoken adversary against the modern React framework. They ultimately all suffer from the same symptoms that make them undesirable at scale.

What if scaling up React projects in your flavor of React was configuration based and library based, not framework based? What if I don't want to wrestle with frameworks.

Here's what you really want to know:

1. How do I manage routing?
   1. React Router
   2. Tanstack Router
   3. Custom
2. How do I manage global state if there is any (Client Side)
   1. Zustand
   2. React Context
   3. Jotai
   4. Redux
   5. Custom
3. How do I manage asynchronous API state if there is any (Server Side - Tanstack Query)
   1. Tanstack Query
   2. Custom
4. How do I want it bundled and with what tools
   1. Webpack
   2. Vite
   3. RsPack
   4. Bun Bundler
   5. esbuild
   6. rolldown
   7. oxc
   8. custom
5. Do I want to use something like babel or swc to transpile in conjunction with my bundler strategy?
   1. Babel
   2. SWC
   3. Custom
6. Do I want or need storybook
   1. Storybook with Chromatic
   2. Custom or None
7. What testing framework do I want to use
   1. Jest with RTL
   2. Bun with RTL
8. What is the render strategy
   1. CSR
   2. Static Site Gen
   3. SSR
      1. With what server?
   4. Isomorphic Strategy with PPR or Edge
   5. Custom
9.  Do I want my own component library or a library
    1.  tailwind with postcss
    2.  tailwind with vite
    3.  picocss
    4.  chakra ui
    5.  custom library with style dictionary
10. What runtime should I default to using
    1.  Node
    2.  Bun
    3.  Deno

And then you need explicit docs about patterns, performance, and best practice.
You also need SDLC Workflow Integrations (For now just claude)

All outputs are going to use turborepo.

The reason for that is that we want to abstract local utilities like prerendering or server side rendering or common configuration or types that support a complete web development environment based on the decisions you made above.

Loose structure:

/ apps
  / web
    / public
    / build
    / src
      / components
      / hooks
      / layout
      / models
      / pages
      / routes
      / services
      / utils
      / App.tsx
      / main.tsx
  / docs
  / api (if needed)
/ packages
  / common
  / types (if using typescript)
  / render-engine (Contents will depend on render strategy)
  / components (If using custom components lib with style dictionary)
package.json
turbo.json
mise.toml
README.md
