---
slug: "bcp"
visible: true
title: "Let's talk about Bit Context Protocol"
---

> **Disclaimer 1** This article is rather large and contains a number of fragmented but interrelated parts. You do not need to read all of it, sections can be expected to be self contained islands.

---

> **Disclaimer 2** Bit Context Protocol is mine and (rightfully attributed) Opus 4.6's scorned love child. So if you feel there is an air of emotional attachment, there likely is. I'm working on decoupling that, like I have towards my biological children.

---

> **Disclaimer 3** I am releasing this article while it is being actively written. Parts of it will go up in chunks. Parts will stop abruptly. Parts will be refactored or excised completely.

## A Word From Our Author

As of writing this, in late February 2026, despite the saturation of the market with models for most every niche purpose, when it comes to software development, there is but only a single family of models that carries its weight and is worth using, and paying money for: The Anthropic Claude Models.

I have no affiliation to Anthropic, they do not pay me and have sent me nothing. I pay them 20$ a month for their pro plan, which I resent until I rationalize it that I am paying 5$ a week for a more competent midling developer than I could have ever imagined, and then I feel less nauseated.

In stark juxtaposition to its excellence is its cost. Which is not excellent. Proportionate to that is the notion that its usage limits on the Pro Plan are obscenely low for the token cost of its more aggressive and consumptive models (Opus). It's maddening, and if I can try to elicit it clearly, it's really this: It has displayed it's value, and it has displayed it's dominance over competition in the technical expertise skillset, but there still remains this large gap between what the consumer (Not the enterprise giants, but the regular every day fucks), are wanting to pay and are able to pay, and what Claude is asking for in compensation. The Pro Plan is synonymous with microdosing, if buying the whole bag of the world's best mushrooms cost millions if not billions of dollars, then I will give you 20$ a month for the shake and stems you have left over - I don't think I actually need to go deeper than that in explanation given what an apt comparison that is. If you hear a noise, it's likely me patting myself on mein own back.  

Anyway, I usually hit my _Claude_ weekly usage limits in the first 2-3 days of the cycle week. I'm not really typically engaging in long winded vibe coding sessions _because that phrase makes me want to chain myself to a greek mountain where large vultures can pick at my ribs for all eternity_- no, I have noticed that my software development sessions with claude take a rather predictable cadence, and they are always flavored in spec driven development. I typically am oscillating between anywhere from 2-6 bodies of work at a given moment, with the ideal being less bodies of work (less context switching). I have become rather good at _tight spec generation_ which is to say, defining the roadmaps and criteria for large featuresets of work within extremely strict confines of technical best practices and patterns. These SPEC documents can be singular or span multiple cohesive ordered documents depending on the scale of the featureset. These spec documents are almost always refined by myself in the format and structure that I have found to be most efficient, and additionally appending on supplementary context I have deemed to be most relevant. When the SPEC documents are in a state where I feel like they can competently and self-sufficiently drive work, I begin a new session with claude opus, I enable planning mode and the orchestration of sub agents, and I mostly feed it the defined SPEC stage I am up to word for word. This has proven to be an extremely productive workflow, as I can competently orchestrate between 3-4 chat sessions of this capacity, each ith its own spec, custom agent, and its own orchestration of subagents. Things that took weeks previously now take hours or minutes. **In the appendix of this article, for transparency's sake, I have attached the entire SPEC documents used to support development on the Bit Context Protocol workspace, since that is what this article is about, it probably is increasingly relevant to include those materials. Adopt transparency in your AI usage trends. Adopt transparency in all aspects.

This project was borne from this issue-case. In summarization, the problem statement being: **The Anthropic Models (namely Opus), have created a new software development workflow pattern that has greatly exacerbated my efficiency as a software engineer, but I am still limited by its extremely low weekly usage limits, which are often met within the first several days of the weekly limit cycle restart. How can I continue to use Opus but in a manner that supports longer development usage without paying additional extra fees and incurring additional usage costs?**

## Breaking down the problem

When we discuss usage limits, we need to discuss what is incorporated into a usage count.

I am pulling the following directly from the [Anthropic: Understanding Usage Limits Article](https://support.claude.com/en/articles/11647753-understanding-usage-and-length-limits)

> What are usage limits?
>
> Usage limits control how much you can interact with Claude over a specific time period. Think of this as your "conversation budget" that determines how many messages you can send to Claude, or how long you can work with Claude Code, before needing to wait for your limit to reset.
>
> Your usage is affected by several factors, including the length and complexity of your conversations, the features you use, and which Claude model you're chatting with. Different subscription plans (Pro, Max, Team, etc.) have different usage allowances, with paid plans offering higher limits.
>
> Note that your usage of all different Claude product surfaces (claude.ai, Claude Code, Claude Desktop) counts towards the same usage limit.

Anthropic danced around giving you a straight answer, a motif you'll notice is all too common with anyone trying to make money in America in 2026. I'll be more direct with you.

By and large, the currency of the modern model age is tokens. A token is a computational unit associated to a fragment of sentiment (a semantic unit of measurement enforced against text (not exclusively)). When Anthropic says "several factors", what they fail to tell you is that all the several factors boil down to the same consumptive measurement- token usage. Opus uses more tokens. Yep it sure does, it can successfully orchestrate subagents, each of which themselves consumes tokens in each task it attempts to complete. Reading a file into context- tokens. Writing output- tokens. Calling a tool- tokens. Everything is token negotiation. So when we discuss the crux of usage limits- our discussion will focus on **reducing token usage while retaining a parity of success criteria to the same task that is not limited by token usage**. How can we produce an output to a task that maintains the same level of quality in a confined token usage window, as the ideal quality response output when no token budget is assigned.  

It is ultimately a many layered question. Some layers are easier to traverse than others.

Let's extract the issues that correspond to our problem statement-

### Weekly Usage limits are extremely tight due to the **rapid token-consumptive nature** of efficient enterprise development

### Context windows in which to work on larger problems are tight before entering a state where a conversation or session needs to compact, often greatly reducing the quality of the output there on out, until a comparable level of context is obtained

We can confidently make the assumption that the token context window will grow. Ultimately, this will prove to be a band-aid. A necessary one, but one that fails to drive at the heart of the issue;

### **Why the fuck do we consume so many tokens when engaging in enterprise spec driven development workflow sessions?**