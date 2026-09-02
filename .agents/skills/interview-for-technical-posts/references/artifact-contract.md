# Interview artifact contract

Store active interview work under:

```text
editorial/interviews/<slug>/
├── session.md
├── transcript.md
├── interview-draft.md
├── article-brief.md
└── article-draft.md        # create only when requested or sufficiently supported
```

Create the directory only after the topic has a stable working slug. Do not overwrite existing artifacts. Use [the session template](../assets/session-template.md) and [the transcript template](../assets/transcript-template.md) when starting a session.

## Source preservation

- Append each interviewer question and user answer to `transcript.md` verbatim.
- Preserve answer order and label the interviewer (`Codex`, `Claude`, or another explicit name).
- Do not retrofit edited prose into the transcript.
- Treat the transcript and session notes as private working artifacts. Do not stage, commit, publish, or send them elsewhere without explicit author approval.
- Replace credentials, tokens, personal data, and explicitly confidential details with `[sensitive detail omitted]`; tell the author whenever this exception to verbatim capture is necessary.
- Put interpretations, merged ideas, and editorial decisions in `session.md`.
- Update `updated` and `next question` before ending a session.

## Working outputs

- Keep `interview-draft.md` as the edited, publishable Q&A candidate.
- Keep `article-brief.md` as the article's thesis, reader promise, structure, evidence plan, and relationship to the interview.
- Create `article-draft.md` only after the brief is supported by the source material or when the author explicitly requests it.
- Keep all three free of site frontmatter while they remain under `editorial/`.

## Project Arcturus publishing contract

Publish approved pieces as Markdown under `packages/content-data/posts/`. Use only fields accepted by `packages/content/src/schema.ts`, in this order:

```yaml
---
title: A non-empty title
date: 'YYYY-MM-DD'
excerpt: A non-empty excerpt.
tags:
  - example
image:
  src: /assets/example.webp
  alt: Meaningful alternative text.
  aspectRatio: 16 / 9
category: SOFTWARE ENGINEERING
subcategory: example
slug: optional-custom-slug
searchTerms:
  - optional
readingTime: optional
featured: false
visible: false
---
```

`slug`, `searchTerms`, and `readingTime` are optional. The build derives the slug from the filename, search terms from tags, and reading time from the body when omitted. `featured` and `visible` default to false, but write both explicitly for new interview-derived drafts. Do not invent image metadata; ask the author to select an image before moving an artifact into the post collection.

The schema rejects unknown keys. Do not add `format`, `interviewer`, `companion`, `aiGenerated`, or other metadata without first implementing and validating a schema change. Express the interview format and disclosure in the title or body until the application supports dedicated metadata.

Validate site-ready content by running `bun run build` with the working directory set to `packages/content-data`. Do not set `visible: true`, replace an existing post, or publish externally without explicit author approval.
