---
slug: "sign-of-life-1"
visible: true
title: "June Updates"
---

I'm dropping a very quick blog post to draw some attention to some technical work that's I've conducted in late May, early June. If you notice a period where technical writing lags, that's likely becuase things are actually getting done.

## Waavy & Waavy-RS

[Github](https://github.com/nicholasgalante1997/waavy)

Waavy is a tool you can use to server side render React components in non-javascript server runtimes. It's inspired by an unholy dream I had where I was SSRing React components in an Actix Web server. Well, a dream deferred is a dream denied. So here we are.

The internal composition is mostly Typescript/TSX, but 

### How it Works

So, I've been messing around with the Bun javascript runtime more and more.  

> As a rule of thumb, I really try not to get excited about new fads in the javascript ecosystem, but Bun is challenging that belief with a vigor.

Bun has support for what they call "Single File Executables", which is by and by a means of creating a standalone executable from a javascript or typescript file. Meaning you technically do not need a javascript runtime to run it. Bun can bundle everything needed to run the script into a single file executable, which makes it pretty portable, (but also recklessly large, we'll talk about this later). So this gave me the idea, could we decouple React from javascript? TLDR, yeah, probably.

Let's break into a high level technical overview.

#### Server Rendering

Rendering React components on the server is really so much easier than framework maintainers would have you believe. In fact, their entire prolonged existence rests on the premise that you believe maintaining your own server infrastructure for a React app is hard work, and that rendering Components, or partially pre-rendering Components on the server or an isomorphic edge runtime is hard work! They think so little of you, that they think you're better off just re-using what they did (Even though Next.js had a 9.1 CVE middleware bypass just 3 short months ago!). Bro. Im gonna lose my shit.

> When I was em

Anyway, server rending React components is easy. ReactDOM makes _several_ APIs available for you to leverage in server or edge runtimes that afford you the ability to render a component (either all in one go, or as a stream), and it provides options for embedding client-side javascript for hydration rendering patterns, as well as allowing for fine tuning of progressive chunk size.  



## Nodext4 and NEDfs

[Github](https://github.com/nicholasgalante1997/nodext4)

