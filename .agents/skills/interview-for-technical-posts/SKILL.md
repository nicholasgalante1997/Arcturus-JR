---
name: interview-for-technical-posts
description: Conduct adaptive, source-grounded technical interviews that turn an author's experience, draft, or thesis into a publishable Q&A and distinct companion article material while preserving the author's voice. Use when the user asks to be interviewed for a technical blog post, develop or finish an article conversationally, resume an editorial interview, turn interview answers into written content, or create/refine companion interview content. Do not use for ordinary copyediting, generic research, or ghostwriting that does not involve an interview.
---

# Interview for Technical Posts

Treat the author as the source and the agent as the interviewer-editor. Elicit the argument before writing it. Produce an edited interview and article material that complement one another instead of repeating the same piece twice.

## Load project guidance

When working in Project Arcturus:

1. Read [references/project-voice.md](references/project-voice.md) completely before asking the first substantive question.
2. Read [references/artifact-contract.md](references/artifact-contract.md) completely before creating or updating interview files.
3. Read the relevant draft, implementation, notes, and two to four thematically similar posts when available.
4. Treat published or authored prose as voice evidence, not as a bag of phrases to imitate.

For another repository, infer its content location and voice sources. Ask only when those cannot be discovered safely.

## Choose the working mode

Infer one mode from the request and available artifacts:

- **Idea to interview:** Develop an undeveloped topic into a publishable technical interview.
- **Draft to companion:** Interview around an existing article so the Q&A adds origin, judgment, tradeoffs, and personality rather than summarizing the article.
- **Interview to article:** Use an interview to generate an article brief or draft without losing the author's reasoning.
- **Resume:** Continue from the recorded session state and ask the documented next question.
- **Synthesize:** Turn a sufficiently complete transcript into editorial artifacts without restarting the interview.

State the inferred mode briefly. Do not present a menu unless the mode is genuinely ambiguous.

## Establish the interview

1. Identify the topic, provisional thesis, audience, and relationship to any existing article.
2. Create the session artifacts after the topic has a stable slug. Preserve any existing files and resume rather than replace them.
3. Start with the highest-leverage question. For a blank topic, ask what claim or experience the author cannot stop thinking about. For an existing draft, ask about the strongest unsupported conviction, formative incident, or consequential tradeoff.
4. Ask exactly one primary question per turn. Never send a questionnaire disguised as prose.

## Run the interview loop

After every answer:

1. Append the question and answer verbatim to `transcript.md`. Do not silently repair grammar, spelling, profanity, or unfinished thoughts in the raw record.
2. Update `session.md` with the current thesis, newly covered ground, claims requiring verification, distinctive phrases, unresolved tensions, and the next best question.
3. Ask a follow-up that responds to the answer just given. Prefer specificity over topic-hopping.
4. Keep interviewer commentary short. Do not praise reflexively, summarize every answer back to the author, or steal momentum with mini-essays.

Use these coverage lanes as a diagnostic, not a fixed questionnaire:

- central claim and intended reader
- origin, stakes, and personal experience
- system or problem context
- technical mechanism and concrete example
- evidence and observable outcomes
- alternatives, rejected approaches, and tradeoffs
- failure modes, boundaries, and uncertainty
- strongest reasonable counterargument
- practical implications and closing conviction

Probe when an answer contains an abstraction, universal claim, euphemism, unexplained term, contradiction, or unusually vivid phrase. Ask for the incident, mechanism, example, comparison, or limit underneath it. Challenge claims without turning the exchange into debate theater.

Do not draft early merely because several answers exist. Consider the interview sufficient when:

- the thesis can be stated without inventing language or intent;
- the technical mechanism has at least one concrete explanation or example;
- meaningful tradeoffs and counterarguments have been addressed;
- factual claims are recorded for verification;
- the interview and companion article have distinguishable editorial jobs; and
- the author has supplied a closing position in their own terms.

## Preserve authorship and voice

Keep three layers distinct:

- **Verbatim source:** Exact user answers in `transcript.md`.
- **Lightly edited answer:** Reordered or tightened only for readability without changing meaning, certainty, or temperament.
- **Editorial bridge:** Agent-written introduction, question, transition, or context. Never present it as a quotation from the author.

Preserve first-person perspective, technical specificity, humor, profanity, parentheticals, strong opinions, and irregular cadence when they are genuinely present. Correct errors that impede comprehension, but do not sand the prose into generic professional copy. Never manufacture jokes, anecdotes, beliefs, credentials, results, or emotional reactions.

When an answer is unclear enough that editing would require interpretation, ask a follow-up instead of guessing. When combining statements from separate answers, preserve the original qualification and record the merge in the session notes.

## Handle technical claims

Separate personal observation, architectural judgment, and externally verifiable fact.

1. Record checkable claims while interviewing without interrupting every answer for research.
2. Verify consequential or time-sensitive claims before producing site-ready copy. Prefer primary sources, code, benchmarks, specifications, and official documentation.
3. Mark unresolved claims clearly. Do not convert an anecdote into a universal conclusion.
4. Ask before publishing details that may be proprietary, confidential, identifying, or attributable to an employer or client.
5. Do not persist credentials, tokens, personal data, or explicitly confidential details in the transcript. Record `[sensitive detail omitted]` and tell the author what was omitted.
6. Retain links and evidence in session notes; use citations in the final post when they materially support the reader.

## Synthesize complementary pieces

When coverage is sufficient, say so briefly and produce the requested artifacts.

### Edited technical interview

Build a readable Q&A rather than a transcript dump:

- Open with a short editorial introduction establishing the subject and why the conversation exists.
- Keep the author's answers dominant.
- Arrange questions into a deliberate arc while preserving the reasoning developed in the interview.
- Remove repetition and verbal scaffolding only when meaning and cadence survive.
- Preserve disagreement, uncertainty, and sharp edges.
- End on the author's conclusion, not an agent-written moral.
- Include an AI-interview/editing disclosure only after confirming the author's preferred wording.

### Companion article material

Give the article a different job:

- Use the interview for origin, judgment, experience, and quotable perspective.
- Use the article for a linear technical explanation, evidence, examples, and actionable conclusions.
- Produce an article brief first unless the user requested a full draft or the session already established the complete structure.
- Cross-link the pieces conceptually, but avoid copying entire answers into the article.
- Write first-person article prose only from supported interview material and existing author-written sources.

Keep working drafts outside the publishable post collection. Move a draft into the site's content directory only when the author asks for site-ready material. Default new site posts to `visible: false` and `featured: false`.

## Resume across sessions

Read `session.md` and the end of `transcript.md`. Report the working thesis, current coverage, unresolved claims, and next question in no more than a short paragraph. Then ask that one question. Do not repeat intake or make the author reconstruct prior answers.

## Refine the skill through use

At the end of a pilot, record friction and successful techniques under `Session feedback`. Distinguish defects in the skill from preferences specific to one article. Propose focused skill changes after evidence from use; do not silently rewrite the skill during an interview.

## Final checks

Before presenting publishable material, confirm that:

- every attributed idea is grounded in the transcript or existing authored material;
- edited answers preserve the author's certainty and intent;
- the interview and article are complementary rather than redundant;
- technical claims are verified, qualified, or explicitly marked unresolved;
- unsupported private details are absent;
- Project Arcturus frontmatter is valid when creating a site post; and
- generated work remains unpublished until the author explicitly approves publication.
