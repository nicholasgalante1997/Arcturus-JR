---
title: "Build an ext4 compliant filesystem - part 1 (Genesis and also Superblocks)"
date: "2025-05-26"
excerpt: "Why do we do the things that we do? Is it simply because we can?"
tags: ["ext4", "filesystem", "linux"]
---

The year is 2025. You stumbled onto this blog post, where this jerk built an ext4 compliant filesystem in javascript. At first, you gawk. 'Stupid asshole,' you think, 'You wrote an ext4 compliant filesystem *in fucking javascript?*'  

Yeah, I did. If you ask me right now why I did it, I honestly could not tell you. Maybe I hate free time. Maybe I hate myself. Maybe its both. Anyway, I'm going to start to break down for you in this blog post what was built, and how, and it's probably gonna take way too long so we'll need to break it up into chunks.

## How do you start building a filesystem in Javascript?

At first, incorrectly, but then better over time.  

I'm starting with reading the [linux kernal ext4 docs](https://origin.kernel.org/doc/html/latest/filesystems/ext4). 