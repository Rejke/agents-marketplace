---
name: clear-writing
description: Make any writing clear, direct, and human. Must always apply.
---

# Clear writing

AI prose fails in two opposite ways. It inflates: puffery, hedging, jargon, "a testament to the evolving landscape". Or it over-corrects into sterile compression: short flat sentences with no opinion, no rhythm, no author. Both read as machine-made. This skill fixes both in one pass so the fixes do not fight each other: the cutting rules target filler, never voice.

## Precedence

When rules collide, resolve in this order:

1. The user's explicit constraints: tone, format, length, style guide, genre.
2. Meaning and accuracy. Never make text crude, false, or flat just to make it short.
3. Remove AI tells (the pattern list below).
4. Clarity and brevity (Orwell, STE).
5. Voice. If cutting a sentence removes an opinion, a concrete detail, or a rhythm change, keep the sentence. Brevity trims filler, not personality.

## Step 0: pick the mode

- **Technical mode** — procedures, documentation, API references, instructions, error messages: anything the reader follows rather than reads. Apply the STE baseline below. One unambiguous meaning beats rhythm.
- **Voice mode** — essays, posts, emails, marketing, scripts, creative prose: anything the reader reads for its own sake. Apply the voice rules below. STE is a clarity aid here, not a requirement.

Orwell's rules and the AI-tell list apply in both modes.

## Core rules (Orwell, adapted)

1. Never use a metaphor, simile, or figure of speech you are used to seeing in print. A fresh, specific image is fine in voice mode; in technical mode prefer the literal statement.
2. Never use a long word where a short one will do. "Utilize" becomes "use", "leverage" becomes "use", "facilitate" becomes "help", "numerous" becomes "many", "in the event that" becomes "if".
3. If it is possible to cut a word out without losing meaning or voice, cut it.
4. Prefer the active voice. Catch "is/are/was/were + past participle" and name the actor: "queries are validated" becomes "the compiler validates queries". Passive is fine only when the actor is unknown or genuinely does not matter.
5. Never use a foreign phrase, a scientific word, or jargon if an everyday English word carries the meaning.
6. Break any of these rules sooner than write anything outright barbarous.

Two rules both source traditions agree on:

- **One term for one thing.** Do not cycle synonyms to avoid repetition ("protagonist, main character, central figure" in one paragraph). Pick a term and repeat it.
- **Say what it does, not how it feels.** "SQL you can read" names a feeling; "`.toSQL()` returns the exact string sent to the database" names a mechanism. If a sentence cannot be restated as a concrete instruction, fact, or number, and it could appear unchanged in another project's docs, cut it.

## AI tells to detect and fix

Scan for these in every piece of text, both modes.

### Content

1. **Puffery.** "pivotal moment", "testament to", "evolving landscape", "setting the stage for", "indelible mark", "deeply rooted". State what happened.
2. **Superficial -ing phrases.** "highlighting...", "ensuring...", "showcasing...", "fostering...". Delete or expand with real substance.
3. **Promotional language.** "nestled", "vibrant", "breathtaking", "groundbreaking", "renowned", "stunning", "must-visit". Use neutral description.
4. **Vague attributions.** "Experts believe", "Industry reports suggest". Name the source or delete.
5. **Formulaic challenges.** "Despite challenges... continues to thrive." Replace with specific facts.
6. **Name-dropping.** Listing outlets or authorities without content. Pick one, say what was said.

### Language

7. **AI vocabulary.** Additionally, crucial, delve, enduring, enhance, fostering, garner, interplay, intricate, landscape (abstract), pivotal, showcase, tapestry (abstract), testament, underscore, vibrant. Replace with plain words.
8. **Fancy ways to say "is".** "serves as", "stands as", "boasts", "features". Say "is" or "has".
9. **"Not just X, but Y."** State the point directly.
10. **Rule of three.** Forcing ideas into groups of three. Use the natural number.
11. **False ranges.** "from X to Y" where X and Y are not on a meaningful scale. List the topics directly.

### Style

12. **Em dashes.** Avoid entirely. Use periods or commas; do not swap in parentheses or en dashes, that trades one tell for another. If a thought needs separation, end the sentence.
13. **Colon as mid-sentence connector.** Colons are fine before a list or example, not as a crutch joining two clauses. Rewrite so the point stands alone.
14. **Boldface overuse.** Do not bold every proper noun or acronym.
15. **Inline-header lists.** A bold label plus colon that restates the line ("**Performance:** Performance improved...") converts to prose. A bold lead-in that names the item and is followed by genuinely new detail is fine.
16. **Title case headings.** Use sentence case.
17. **Decorative emojis.** Remove from headings and bullets.
18. **Curly quotes.** Replace with straight quotes.

### Communication artifacts

19. **Chatbot phrases.** "I hope this helps!", "Let me know if...", "Of course!", "Certainly!". Remove.
20. **Sycophancy.** "Great question! You're absolutely right!" Respond directly.
21. **Cutoff disclaimers.** "While specific details are limited..." Find the facts or remove.

### Filler

22. **Filler phrases.** "In order to" becomes "To". "Due to the fact that" becomes "Because". "It is important to note that" gets deleted.
23. **Excessive hedging.** "could potentially possibly be argued that it might" becomes "may".
24. **Generic conclusions.** "The future looks bright." State specific plans or facts, or end earlier.
25. **Adverbs propping up weak verbs.** "runs quickly" becomes "is fast" or the number. "significantly improves" becomes the measured delta.

### Jargon

26. **Abstract metaphor nouns.** Substrate, wedge, vector, locus, nexus, primitive (as noun), harness (as metaphor), surface (as in "API surface"), bedrock, scaffolding (as metaphor), modality, paradigm, ratchet (as metaphor), north star, flywheel, endgame. Each has a plainer concrete word: "substrate" becomes "base", "wedge in" becomes "add", "endgame" becomes "the last phase". Pick the concrete word.

## Technical mode: STE baseline

Based on ASD-STE100 Simplified Technical English. Do not claim strict STE conformance without checking the current issue and dictionary.

1. Use short sentences. Put one main action or statement in each sentence.
2. Use a clear subject and an active verb. Name the actor when the actor matters.
3. Use familiar words with one precise meaning. Avoid idioms, slang, and figurative language.
4. Use a specific technical term when accuracy needs it. Define it or link to its definition.
5. Keep noun groups short. Use prepositions to show relationships between terms.
6. Write procedures as direct instructions. State the condition, the action, and the expected result.
7. Use positive instructions: state what the reader must do.
8. Preserve code, commands, identifiers, product names, legal text, and required quotations. Never simplify them silently.
9. When strict STE is impossible, keep the text clear and mark the terms that need a domain exception.

## Voice mode: keep it human

Removing tells is half the job. Sterile, voiceless writing is just as obviously machine-made, and mechanical application of the cutting rules produces exactly that. In voice mode:

- **Have opinions.** React to facts instead of neutrally listing pros and cons.
- **Vary rhythm.** Short sentences. Then longer ones that take their time. In this mode, rhythm outranks the STE one-action-per-sentence rule.
- **Acknowledge complexity.** "Impressive but also kind of unsettling" beats "impressive".
- **Use "I" when it fits.** First person is not unprofessional.
- **Let some mess in.** Perfect parallel structure in every paragraph looks machine-made.
- **Be specific.** Not "this is concerning" but "there's something unsettling about agents churning away at 3am".

For fiction, poetry, memoir, scripts, and lyrical prose, keep intentional ambiguity, cadence, dialogue style, imagery, and character voice when they create a real effect. Remove only language that feels inherited, inflated, evasive, or lazy.

## Workflow

Drafting from scratch:

1. Identify the audience, purpose, and tone from the request; pick the mode.
2. Draft in concrete, direct English.
3. Scan against the AI-tell list and rewrite the hits.
4. Apply the mode rules: STE pass in technical mode, voice pass in voice mode.
5. Self-audit: "What makes this obviously AI-generated?" Fix the remaining tells. Then the opposite check: "Where did editing flatten the voice?" Restore it.

Revising existing text:

1. Preserve the meaning and any explicit tone or format constraints.
2. Cut words, clauses, and sentences that do no work.
3. Scan against the AI-tell list and rewrite the hits.
4. Convert passive to active where the actor is known and matters.
5. Flag jargon or passive voice that is necessary for precision instead of silently removing it.
6. Run the same two-way self-audit: no remaining tells, no flattened voice.
