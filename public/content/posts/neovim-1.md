---
slug: "/developers/series/neovim/one"
visible: true
title: "Learning NeoVim - A Case Study"
description: "2025 is the year of growth. Refusing to grow is accepting to die. Alright maybe that's a lot. Either way, we're gonna become proficient at neovim this year. It's my new year's resolution of sorts. Also, I want to belong to that 1%. You know the one I'm talking about. That class of developer that literally never leaves their terminal, demolishes tickets, and grows larger via sucking in the souls of lesser lifeforms."
media:
  - source: "/assets/doodles-ember.avif"
    alt: "An image from the 'Doodles' NFT collection"
    aspectRatio: "16 / 9"
author:
  - first_name: "Nick"
    last_name: "Galante"
    email: "rustycloud42@protonmail.com"
    github: "nicholasgalante1997"
    avatar: "/assets/headshot.jpg"
    nickname: "Cthu"
    id: '001'
releaseDate: "12/28/2024"
estimatedReadingTime: "A Series (Extended)"
category: "CASE STUDY"
archCategory: "SOFTWARE ENGINEERING"
searchTerms:
  - NeoVim
  - Case Study
  - Editors
genres:
  - "NeoVim"
  - "Software Engineering"
  - "Case Study"
---

*Foreground*

Let's do a thought exercise. I'd like for you to picture the worst developer you have worked with. Try and recall a time in which they needed your support in debugging and it was particularly irritiating. You've got 9 tickets in-progress and it's thursday, but you're in a slack huddle right now looking at their editor (which, let's be honest, is in light mode). What editor are they using?

I hope you said VSCode, or maybe eclipse if you're trying to show your age, but I _know_ you didn't say neovim.

Why didn't you say NeoVim? There's no direct correlation to the editor you use and how proficient you are at a given software development task. But still, you didn't say neovim. Huh, weird.  

One day, despite their being again absolutely no correlation to editor usage and software proficiency, I'll sit down and write about the guy that taught me about [ms paint IDE](https://github.com/MSPaintIDE/MSPaintIDE?tab=readme-ov-file), and how he is, unrelatedly I have to add, the most intelligent person I know.  

> Holy hell MS Paint IDE. What a thing. The [guy who made it]'s github tagline literally says "What you call a waste of time, I call my projects". If I was ever in the market for a new hero, this guy makes the board.  

Well it's 2025. Im ready to be hurt again. We're going all in on neovim this year. Join me for the ride.

## January 08, 2025

### Installation  

Installation was light, both on MacOS and Linux. [The Guide](https://github.com/neovim/neovim/blob/master/INSTALL.md) on their github is straightforward and written well.  

If you're a Mac user, just use homebrew.

```bash
brew install neovim
```

If you're a Linux user, you're probably using a distro that has a package manager. Use your package manager to install neovim. I run Ubuntu 24 and some Pop_OS systems, which spoiler alert is fucking amazing but also not super widely known yet. Was able to get away with using snap there.  

**Ubuntu 24:**

```bash
sudo apt install neovim
```

**Pop_OS:**

```bash
sudo snap install nvim --classic --beta
```

> Sidebar: Im gonna run another series where we get pretty intimate (gross) with the Pop_OS operating system. We're gonna dig into it. What's it like using it. What sucks about it? Why aren't other operating systems cosmos themed? Why does the System76 Pangolin Track Pad suck so hard? We'll try to answer all of the above. We'll also do a deep dive into some of the source code, which I hear is now predominantly Rust!  

### Kickstart

Okay so, I have been recommended by a buddy to use this thing called [nvim.kickstart](https://github.com/nvim-lua/kickstart.nvim) to supercharge my neovim experience.  

My expectations were low. My expectations are almost always low. I try to be a pragmatist. So that's probably why. However, the last 6 months, I don't know man. Software has been here forcing me to practice a little optimism. Recently got into Bun/Zig and just wow. My bar was so low and I was so wrong. Both projects are phenomenal. So I'm taking that reluctant optimism with me into neovim.  

Kickstart did not make me regret that so far. Wow. Dude hats off. Soup to nuts, this thing is another exercise in simplicity getting set up. Basically, the whole thing boils down to forking [this repo](https://github.com/nvim-lua/kickstart.nvim) (Dog, don't be lazy just fork the forking thing) and then cloning it into `$HOME/.config/nvim`. That's actually it. Then the next time you run `nvim` the thing spazzes so hard for like 20 seconds and then metamorphoses out of its cocoon into a fully usable editor, baked in with some plugins that make setting up language servers pretty easy, for like syntax highlighting and stuff. However, VSCode users note, the language server setup that it comes out of the box with is not synonymous with VSCode's intellisense/autocompletion. So I guess that's going to be our next task.  

Here's perhaps some of the coolest stuff about kickstart from a guy who's used it for all of 86 seconds.

- I'm not wrestling with plugin configuration because I don't know Lua and right now I don't wanna learn Lua. I just wanna use neovim. I'll learn Lua later I swear. Also, don't come back later.  
- The :Tutor command (If you're following along, you gotta run this.)
- [This video](https://www.youtube.com/watch?v=m8C0Cq9Uv9o) from tjdevries which has ok sound effects not gonna hate

**I'll even include it below. You can't escape it!**

<iframe width="560" height="315" src="https://www.youtube.com/embed/m8C0Cq9Uv9o?si=wMRc7addSF7wpHmw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

- Instant language server setup
- The :Tutor command again (Worth it)
- The out of the box theme is not bad. Take it as a compliment or leave it.  

## February 13, 2025

Okay, we're back after roughly a month. Feeling comfortable enough to use it at work on a screenshare with co-workers, so not bad. Have been able to keep up with it enough to knock out a few small editing tasks a day. Updates to deployment files, quick file explorer stuff.

### Intellisense, Language Server Protocol Setup

Okay so I teased at it, but I think, starting out with neovim, you'll want to set up their version of intellisense. 