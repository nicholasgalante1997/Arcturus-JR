---
slug: "webpack-externals-and-es6-import-maps"
visible: true
title: "Reducing the Size of Webpack Bundles using Import Maps and Externals"
---

## Smaller is better, just ask my wife

We all want smaller chunks and entrypoints, but modern browser applications maintain dozens, if not hundreds, of dependencies. How can we remedy these two contrasting needs?  

Tree-shaking was a great start, and it allowed us to trim down unnecessary modules from our final bundle. Chunking modules into smaller on-demand chunks further supported better web vitals. But what happens when those strategies fall short, and we still end up with a 982kb `main.js` entrypoint file and an obvious slow first page load?

Let's remediate bundling vendor dependencies with Webpack Externals and Import Maps.

## What are Import Maps?

> An import map is a JSON object that allows developers to control how the browser resolves module specifiers when importing JavaScript modules. It provides a mapping between the text used as the module specifier in an import statement or import() operator, and the corresponding value that will replace the text when resolving the specifier.  

MDN's long-winded way of saying, modern browsers have a methodology to import aliasing that allows us to load our dependencies in the browser from a source like

`https://esm.sh/gsap@3.12.2`

and when it encounters an

`import gsap from 'gsap';` statement

or

`import('gsap')` expression

it will replace the module specifier with the value provided in the import map.

Here's a practical example:

```html
<!doctype html>
<html>
    <head>
        <script type="importmap">
            {
                "imports": {
                    "gsap": "https://esm.sh/gsap@3.12.2"
                }
            }
        </script>
    </head>
    <body>
        <div class="hero-section">
            ...
        </div>
        <script type="module">
            import gsap from 'gsap';

            document.addEventListener('DOMContentLoaded', () => {
                gsap.to('.hero-section', {
                    ...
                });
            })
        </script>
    </body>
</html>
```

Now when this markup document is loaded by the browser, by the time our browser encounters our inline script's `import gsap from 'gsap';` statement, it will replace the module specifier with the value provided in the import map, which is `https://esm.sh/gsap@3.12.2`, and will load the default export `gsap` module from that URL.

You can even optimize this with very trivial effort:

```html
<!doctype html>
<html>
    <head>
      <link rel="preload" crossorigin="anonymous" as="script" href="https://esm.sh/gsap@3.12.2">
      <script type="importmap">
        {
            "imports": {
                "gsap": "https://esm.sh/gsap@3.12.2"
            }
        }
      </script>
    </head>
    ...
</html>
```

Or more specifically, since we're using esm, we can do this:

```html
<!doctype html>
<html>
    <head>
      <!-- There is partial browser support for integrity within import maps, but we won't get into that here -->
      <link rel="modulepreload" crossorigin="anonymous" href="https://esm.sh/gsap@3.12.2">
      <script type="importmap">
        {
            "imports": {
                "gsap": "https://esm.sh/gsap@3.12.2"
            }
        }
      </script>
```

You can read more about modulepreload here: [MDN Module Preload Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/modulepreload)

From the mdn docs, when we specify our import via a preload link in such a way:

> The preload value of the <link> element's rel attribute lets you declare fetch requests in the HTML's <head>, specifying resources that your page will need very soon, which you want to start loading early in the page lifecycle, before browsers' main rendering machinery kicks in. This ensures they are available earlier and are less likely to block the page's render, improving performance.

So we can, with very trivial effort, optimize the loading of our gsap module from the provided source.

#### Browser Support Sidebar

Import maps and modulepreload are features that have become baseline available in 2023.  

[caniuse import maps](https://caniuse.com/?search=import%20maps)

[caniuse modulepreload](https://caniuse.com/?search=modulepreload)
<br />

#### But Nick, I'm worried about things like <esm.sh> being down, or malicious actor attacks in external cdn providers. I have a high availability app

Okay, that's not really a hard issue to solve. We did this with vendor dependencies back in 2003 (I was 6 in 2003). Download a trusted copy, and serve it yourself with your app. You now do not need to load any cross origin resources, and you can setup a fairly aggressive caching policy in such a case that would assist you in optimizing your app even further. Your deps source code is only going to change when you bump the version, so you can cache very aggressively bc any update will cache-bust as it resolves to a new version stamped url.

So do we still need bundlers?

Short answer, yes.

Long answer, no you probably never needed them but that ship has sailed and this is where we're at now.

## What are Webpack Externals?

> The externals configuration option provides a way of excluding dependencies from the output bundles. Instead, the created bundle relies on that dependency to be present in the consumer's (any end-user application) environment. This feature is typically most useful to library developers, however there are a variety of applications for it.

Let's walk through a small practical example:

Let's say we have a project X that has a dependency on the animation library `gsap`. 

```javascript
import gsap from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    gsap.to('.hero-section', {
        ...
    });
})
```

Now when we bundle this application, we'll have a either an entrypoint file or a chunk file, depending on how our webpack config is configured, that contains the module code for the default export of `gsap`.  It's going to be somewhere in that bundled output.

Alternatively, when we update our webpack.config.js to have an external field as follows:

```javascript
externals: {
  gsap: 'gsap'
}
```

If we re-bundle our application, you'll notice that the `gsap` module is no longer included in the final output bundle anywhere, and we've actually retained our `import gsap from 'gsap';` statement.

You might be asking at this point, well if we're excluding our deps from the final bundle, why are we even bundling?  

There's a number of things your bundler does for you, and there is still a benefit to bundling your source code files into a single (low size) cacheable entrypoint file, even if you exclude your source code's dependencies from that bundle.

When you bundle your app for production, webpack, in conjunction with babel or some other loader, performs a number of optimizations, and minifications, and transforms on your code to create the final output bundle, and to transform the source code for the specified target environment of your choice.

You're also probably using react, because you bought in when it was hot before it started to show its obvious signs of decadence. You and me both. So in that case, I don't imagine you're writing `React.createElement(...)` calls everywhere, you're probably writing jsx and in that case, you need babel or a transform layer to turn your jsx, which browsers can't grok, into a digestable esm or commonjs syntax. You could just use babel yourself and transpile, but you're more likely using webpack for a legacy or enterprise application and are using babel via the babel-loader to transform your source code. So you can't opt out of bundling just yet.

Let's get into a practical react example.

## A Practical React Example

> Disclaimer, I generated this example react app with Claude. This is what AI is for. Building out the useless throwaway source code examples that I need for my blog. If you're using AI for vibe coding for actual users, some angry rube with a kali linux distro on a Georgian host is going to eat you alive. You were warned.

Okay so we're gonna put our money where our mouth is here. We've scaffolded a Client Side Rendered react app with the following project structure:

```txt
pokemon-grade/
├── package.json
├── webpack.config.js
├── babel.config.js
├── public/
│   ├── index.html
│   └── favicon.ico
└── src/
    ├── index.js
    ├── App.js
    ├── components/
    │   ├── Header.js
    │   ├── Hero.js
    ├── utils/
    │   └── api.js
    └── styles/
        ├── global.css
        ├── Header.css
        ├── Hero.css
```

And we're gonna treat it like a simple client side rendered SPA react app.

Here's the app:

![PokeGrade UI](/assets/screenshots/pokegrade-ui.png)

Here's our webpack config:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    })
  ]
};
```

This is intentionally super basic, with no bundle chunking; It's just a single entrypoint file and a single output file for a React <Hero /> component mock page. It has dependencies only on `react`, `react-dom`, and `gsap` for a simple entrance animation.

You can see the source code here: [github.com/nicholasgalante1997/Arcturus-JR/tree/main/examples/webpack-externals-and-es6-import-maps/bundled](https://github.com/nicholasgalante1997/Arcturus-JR/tree/main/examples/webpack-externals-and-es6-import-maps/bundled)

Now let's take a look at the output of the build from this app:

![PokeGrade Output](/assets/screenshots/pokegrade-build-output-bundled.png)

**That entrypoint bloated all the way up to 326kb**, that's not great! This app does nothing! Has barely any dependencies. No routing. No data layer. No state management solution, and it is already larger than the recommended entrypoint bundle size:

```log
<b>WARNING</b> in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
```

Let's convert this same application to leverage import maps and webpack externals instead, which we can do with adjustments **_solely to the index.html template file and webpack.config.js_**, it requires us to change absolutely no source code.

Let's update our index.html file first:

```html
<!doctype html>
<html lang="en">
  <head>
    ...
    <link rel="modulepreload" crossorigin="anonymous" href="https://esm.sh/react@19" />
    <link rel="modulepreload" crossorigin="anonymous" href="https://esm.sh/react-dom@19" />
    <link rel="modulepreload" crossorigin="anonymous" href="https://esm.sh/gsap@3.12.2" />
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@19",
          "react-dom": "https://esm.sh/react-dom@19",
          "gsap": "https://esm.sh/gsap@3.12.2"
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    ...
  </body>
</html>
```

We have added preload links for all of our dependencies, and we have added a script tag with an import map for all of our dependencies. Now let's update our webpack.config.js file:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PackageJson = require('./package.json');

function mapDependenciesToExternals(deps) {
  return Object.keys(deps)
    .map((dep) => ({ [dep]: dep }))
    .reduce((acc, next) => Object.assign(acc, next), {});
}

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  target: ['web', 'es2023'],
  output: {
    clean: false,
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].[contenthash].js',
    module: true,
    chunkFormat: 'module'
  },
  experiments: {
    outputModule: true
  },
  externalsType: 'module',
  externals: mapDependenciesToExternals(PackageJson.dependencies),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      filename: 'index.html',
      inject: 'head',
      chunks: ['main'],
      publicPath: '/',
      title: 'PokeGrade',
      minify: {
        html5: true
      },
      scriptLoading: 'module'
    })
  ]
};
```

Now let's take a look at the output of the build from this app:

![PokeGrade Output](/assets/screenshots/pokegrade-build-output-external.png)

Okay, so it's definitely bigger than I would like it to be at 248kb, but it's still **24% smaller** than our original bundle size. So it's an improvement. If we didn't bundle our css using css-loader/style-loader, we'd be under our target size of 244kb.

#### Sidebar: Stop Bundling Your Assets

As a sidebar, I do not recommend bundling your styles or assets into your javascript. I almost always suggest figuring out a way to hoist this to the html or markup level and letting the browser do the work.

```jsx
import 'public/css/cow.css';
import cow from 'public/assets/cow.png';

import React from 'react';

function Cow() {
  return <img src={cow} />;
}

export default Cow;
```

This above snippet is an all too common antipattern.

This file could be:

```jsx
import React from 'react';

function Cow() {
  return (
    <>
      <link rel="stylesheet" href="/css/cow.css">
      <img src="/assets/cow.png" />;
    </>
  );
}

export default Cow;
```

This is much preferred to having your bundler now need to bloat the javascript output with non javascript content, like assets and css sheets. Clear dependency separation.

## Closing Thoughts

If you haven't caught it yet, I think the larger motif here is that modern browsers are evolving and they're powerful. Individual features and developments like `modulepreload` and `import-maps` can be leveraged in specific conjunctive contexts to afford us better developer experiences (reduced build time and bundle size) and potentially better performance (faster initial page load due to smaller bundle sizes).

This current blog site doesn't use react (I don't mix business and pleasure), but it does leverage the above approach leveraging webpack externals and import maps, and it's total application source code after bundling is ~9kb. It's working for me for now. Ultimately, if this has inspired you to branch off and try this out and see if this works for you, I would recommend extensive testing in a staging environment to ensure you're not seeing any performance degradation. You can use a tool like [Page Speed Insights](https://pagespeed.web.dev/) to do so.
