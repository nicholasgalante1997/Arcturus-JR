---
slug: "/developers/mfes/system-audit-part-one"
visible: true
title: "Auditing an Internal Microfrontend System at Moderate Scale - Part 1"
description: "The pursuit of perfect software is the pursuit of perfect processes; and a bunch of other things you can say at parties to indicate that you believe progress is usually a snake eating its own tail."
media:
  - source: "/assets/doodles-adventurer.jpg"
    alt: "A 'Doodles' style landscape image of a lone doodle about to embark on an adventure through a valley, with several mountains in the background."
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
estimatedReadingTime: "20 minutes"
category: "CASE STUDY"
archCategory: "SOFTWARE ENGINEERING"
searchTerms:
  - Springfield
  - System Audit
  - Microfrontends
genres:
  - "System Audit"
  - "Software Engineering"
  - "Microfrontends"
---

# The System

*You can read this if you'd like to gather a better understanding of the system that was audited, or you could also not. Reading it will not impact your ability to understand the concepts discussed in the article hereafter.*

The system that we'll be discussing today is a microfrontend system that is aggregated to compose an internal employee dashboard at company X. This dashboard contains a number of different functionalities, usually expressed as different tabs that are made available in this dashboard to the employee user.  

This system does not leverage modern microfrontend composition tooling, such as `bit`, `module federation`, or `native federation`. Instead, it instead aligns closer to a standard node package management system, through which domain teams publish versions of their packages, and expose necessary modules to the consuming scope to achieve a set of functionality or make available a certain slice of UI. Within this system, dependency management, bundling, and runtime composition of dependencies are all handled by a shared build tooling across all of the microfrontends. This tooling also makes available various development functionalities as well, such as a linter and a development server.

It undergoes monthly releases in its hosting and sub packages. Instead of the aforementioned tooling, Company X leverages a custom tooling/abstraction that helps achieve the end goal of aggregated microfrontend composition. There is not a strict vertical or horizontal compositional split. Sometimes entire views are owned by a single domain team. Sometimes, the hosting application composes a page-like view from an aggregation of smaller horizontal microfrontends that it imports from domain microfrontends and composes at the host layer.

Company X services tens of millions of customers within the United States.

## Summary

> What would benefit people the most here? What can we abstract away from being about our modern ui tooling, and more about using things like babel and tree-sitter to convert source code files to ASTs, deriving meaning from those AST's for specific purposes, and then effectively creating a graph that allows for meaningful relationships between those data points

*Epilogue, A Incoherent Rant Disparaging Agile Processes (You Can Stop Here, Weary Traveler)*

Okay, so I'm young enough, or old enough depending on when you're reading this, to have first learned what an Ouroboros was through Resident Evil 5 for Xbox 360. Remember that thing, with the red rings of death? It was sick. You know what's sicker? Ouroboros. Which is essentially a snake deity that eats its own tail in perpetuity, representing the cyclical interconnectedness of life and death, and the larger infinitum that we get to fuck around in. Pretty cool. Here's how it's related to software development and software processes.  

Refinement of software processes is necessary. Iterative growth or iterative change to the implementation of software processes is necessary when supported with valid data to suggest action. When you mull on these two things, you think, these are indications of progress. We're moving forward in a direction that we're supporting iteratively with data to reaffirm the movement is functionally beneficial. Ideally, you're using quasi-objective data points to support what functional changes meet the success criteria of "better than what we had". Maybe this is Story Points if you feel extremely confidently across your entire team that every individual is accurately weighting tasks. Maybe it's the consistentcy of release cycles. Maybe no ticket ever gets extended into the next sprint. 

 I don't think it's ultimately that straightforward. 

You have my word going forward that I will wax less poetically and this will be primarily about software and system audits.

---

RAW NOTES


# The System

*You can read this if you'd like to gather a better understanding of the system that was audited, or you could also not.*

> The system that we'll be discussing today is a microfrontend system that is aggregated to compose an internal employee dashboard at company X. This system does not leverage modern microfrontend composition tooling, such as `bit`, `module federation`, or `native federation`. It's existence predates these toolings, but it itself is still in existence and in use by hundreds of thousands of employees daily. It undergoes monthly releases in its hosting and sub packages. Instead of the aforementioned tooling, Company X leverages a custom tooling/abstraction that helps achieve the end goal of aggregated microfrontend composition. Company X services tens of millions of customers within the United States.
>
> First, we'll discuss architecture and intent, and then move into composition/implementation (without divulging any proprietary stuff).  
> 
> As far as intent and architecture, this tooling wears a lot of hats. It's intended to first and foremost act as a dependency management tool for mfes (microfrontends) within the system to ingest other mfes. That makes sense from a microfrontend perspective, as within the mfe architecture, microfrontends need a way to expose, ingest, and releverage other microfrontends. To this extent, 

# Abstract

I would love to say that by the time a software system reaches a level of maturity, that there's a level of simplicity and cohesion that has emerged that fosters more rapid and autonomous development. That's likely the way things *should* be. But we don't live in an ideal world, and it is the case often enough in *enterprise software* that when a system reaches a state of advanced maturity, development can actually degrade and slow, becoming more cumbersome to navigate for even talented developers.  

There are a number of reasons why this happens. Lack of clear patterns and documentation, that's a big one. Custom internal tooling (we'll dive more into the specifics of this one later), while necessary at a certain point for most large enough companies, when not properly documented, upgraded, or maintained can also become a huge bottleneck; The first two issues lead to a greater degree of more nuanced localized issues for teams working within the system. The largest likely is duplicated efforts, which really degrades the benefits of a plug and play mfe architecture anyway. 

---