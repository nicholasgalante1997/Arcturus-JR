---
title: Getting Setup with the beta React Compiler
date: "2024-04-20"
visible: true
---

Here's the breakdown of how this is going to go:  

1. A Brief Overview of React Compiler
2. Migration Updates
3. Verifying React Compiler Setup

<br />

## Brief Overview of React Compiler

**What is React Compiler?**  

> React Compiler is a new experimental compiler that we've open sourced to get early feedback from the community. It is a build-time only tool that automatically optimizes your React app. It works with plain JavaScript, and understands the Rules of React, so you don't need to rewrite any code to use it.  

That's right from the React team. So what is React Compiler going to do for you? It's going to allow us to deprecate the usage of manual memoization calls with useMemo, same for useCallback, and memo; because now React Compiler will attempt to automate the optimization of Function Components and hooks. Been meaning to memoize and never got around to it? No worries, React Compiler's going to now do it for you, to the best of it's ability.  

I would also highly recommend watching the below video, which is the React Conf 2024 React Compiler Case Studies Talk: Forget About Memo. In the video, Lauren Tan walks us through using the react compiler in the decentralized social media application, Bluesky, which is built with React and Expo.  

<iframe width="560" height="315" src="https://www.youtube.com/embed/T8TZQ6k4SLE?si=AwrtrmChNxgRtgbo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Migration Updates

So let's now dive into what we can do to migrate over to using React Compiler, how we determined what to do, and how we verified it worked.  

Foremost, I followed [this guide](https://react.dev/learn/react-compiler) for the majority of this migration.  

First, make sure you upgrade your react dependency before you do this. You can run the following command to update your React version to the latest version of React 19 beta. The React 19 beta package has been updated quite a bit in the last few weeks, so if you migrated to React 19 beta previously there's a good shot your version is stale already. You can play it safe by just running the below command.  

```bash
pnpm install react@beta react-dom@beta 
```

Your package JSON should now also have the following modifications made to it:

```json
{
  "dependencies": {
    "@types/react": "npm:types-react@beta",
    "@types/react-dom": "npm:types-react-dom@beta"
  },
  "overrides": {
    "@types/react": "npm:types-react@beta",
    "@types/react-dom": "npm:types-react-dom@beta"
  }
}
```

So to get a feel for our app's compatibility with React Compiler, we can run the following health check, which is the first thing I did and recommend you doing.  

```bash
$ npx react-compiler-healthcheck

> Successfully compiled 18 out of 23 components.
> StrictMode usage not found.
> Found no usage of incompatible libraries.

```

Next, we want to set up linting rules that support using React Compiler. We can install the eslint plugin witht he following command:  

> If you don't lint, skip this. I wish more people did not lint. Eslint is so opinionated and ultimately offers so little.

```bash
pnpm install eslint-plugin-react-compiler
```

And we can update our eslint config as follows, along with maintaining your other linting rules.  

```js
plugins: [
    'eslint-plugin-react-compiler',
],
rules: {
    'react-compiler/react-compiler': "error",
},
```

We'll write a custom babel loader in this next step, which uses the `babel-plugin-react-compiler` plugin, and transpiles our react code with React Compiler.

First, I created a module for the ReactCompilerBabelConfig so that we could house react compiler config in it's own standalone file.

**babel-react-compiler.config.cjs**  

```js
module.exports = {
 sources: (filename) => {
   return filename.includes('src');;
 }
}
```

With this configuration, we're stating that we only want React Compiler to transpile files that are from the src directory.

**babel-react-compiler.loader.cjs**  

```js
const { transformSync } = require('@babel/core');
const BabelPluginReactCompiler = require('babel-plugin-react-compiler');
const BabelPresetEnv = require('@babel/preset-env');
const BabelPresetReact = require('@babel/preset-react');
const BabelPresetTs = require('@babel/preset-typescript');
const reactCompilerConfig = require('./babel-react-compiler.config.cjs');

function reactCompilerLoader(sourceCode, sourceMap) {
  const result = transformSync(sourceCode, {
    filename: this.resourcePath, // Absolute path to file
    presets: [BabelPresetEnv, BabelPresetReact, BabelPresetTs],
    plugins: [
      [BabelPluginReactCompiler, reactCompilerConfig],
    ],
  });

  if (result === null) {
    this.callback(
      Error(
        `Failed to transform "${this.resourcePath}"`
      )
    );
    return;
  }

  this.callback(
    null,
    result.code,
    result.map === null ? undefined : result.map
  );
}

module.exports = reactCompilerLoader;
```

If you want a more in-depth understanding of what's going on here, it would be helpful to review writing a loader and the babel transformSync function. But basically what's going on here is we're transforming our source code with babel transformSync function and we're configuring babel to transpile our code with the typescript, react, and env presets, and the babelReactCompiler plugin, which is itself configured with our babel-react-compiler config.cjs default export.  

So now we can update our webpack configuration files as follows:

**webpack.cjs**  

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: path.resolve(process.cwd(), 'webpack', 'babel-react-compiler.loader.cjs'),
        }
      }
    ]
  },
  // ...Rest of config
};
```

**Issues you might hit**  

`[variable].useMemoCache is not a function`

Update your React 19 dependency.

`Module not found: Error: Default condition should be last one.`

Check out this stack overflow article. It's likely that one of your dependencies is incorrectly using the package.json exports field to make their modules available. If it's a package your team owns, awesome. Make the above suggested tweak, and correct your dependency package's package.json exports field. If it's not a package your team owns, get over to that package's github and open an issue.  

## Verifying React Compiler Setup

You're able to verify you're setup with the react compiler via the react devtools browser extensions, which will now present automatically memoized components with a ✨ 

If you're able to see the ✨ symbol, you're good to go!
