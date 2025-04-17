---
slug: "webpack-externals-and-es6-import-maps"
visible: true
title: "Reducing the Size of Webpack Bundles using Import Maps and Externals"
---

## Smaller is better, just ask my wife

We all want smaller chunks and entrypoints, but modern browser applications maintain dozens, if not hundreds, of dependencies. How can we remedy these two contrasting needs?  

Tree-shaking was a great start, and it allowed us to trim down unnecessary modules from our final bundle. Chunking modules into smaller on-demand chunks further reduced the bundle size. But what happens when those strategies fall short, and we still end up with a 982kb `main.js` entrypoint file?

Let's remediate bundling vendor dependencies with Webpack Externals and Import Maps.

## What are Webpack Externals?

> The externals configuration option provides a way of excluding dependencies from the output bundles. Instead, the created bundle relies on that dependency to be present in the consumer's (any end-user application) environment. This feature is typically most useful to library developers, however there are a variety of applications for it.

