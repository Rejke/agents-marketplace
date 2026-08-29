---
name: clear-writing
description: Make any writing clear, direct, and human. ALWAYS USE IT, before writing any prose in any language, including chat replies, explanations, docs, and summaries.
---

# Clear writing

AI prose fails in two directions. It inflates into puffery and jargon, or it compresses into flat sentences with no author. Fix both in one pass. Cut filler, keep voice.

## Process

1. Pick the mode. **Technical**: text the reader follows (docs, procedures, references, error messages). **Voice**: text the reader reads (essays, posts, emails, marketing, fiction).
2. Draft or revise in concrete, direct English. Apply the six rules.
3. Scan for the tells below. Rewrite every hit.
4. Apply the mode section.
5. Audit both ways: "What makes this obviously AI generated?" Fix it. "Where did editing flatten the voice?" Restore it. Done when both questions come back empty.

When rules collide: the user's explicit constraints win, then meaning, then tell removal, then brevity, then voice. Keep a sentence that carries an opinion, a concrete detail, or a rhythm change even when it could be cut.

## The six rules

1. Never use a metaphor, simile, or figure of speech you are used to seeing in print.
2. Never use a long word where a short one will do.
3. If it is possible to cut a word out, cut it.
4. Use the active voice. Catch "is/are/was/were + past participle" and name the actor: "queries are validated" becomes "the compiler validates queries". Passive is fine when the actor is unknown or does not matter.
5. Use everyday English instead of foreign, scientific, or jargon words.
6. Break any of these rules sooner than write anything outright barbarous.

## Tells

### Content

- **Puffery.** "pivotal moment", "testament to", "evolving landscape", "indelible mark", "deeply rooted". State what happened.
- **Superficial -ing phrases.** "highlighting...", "ensuring...", "showcasing...", "fostering...". Delete or expand with real substance.
- **Promotional language.** "nestled", "vibrant", "breathtaking", "groundbreaking", "renowned", "must-visit". Describe neutrally.
- **Vague attributions.** "Experts believe", "Industry reports suggest". Name the source or delete.
- **Formulaic challenges.** "Despite challenges... continues to thrive." Replace with specific facts.
- **Name-dropping.** Authorities or outlets listed without content. Pick one, say what was said.

### Language

- **AI vocabulary.** Additionally, crucial, delve, enduring, enhance, foster, garner, interplay, intricate, landscape (abstract), pivotal, showcase, tapestry (abstract), testament, underscore, utilize, leverage, facilitate, numerous. Swap for the plain word: "utilize" becomes "use", "facilitate" becomes "help", "numerous" becomes "many", "in the event that" becomes "if".
- **Fancy ways to say "is".** "serves as", "stands as", "boasts", "features". Say "is" or "has".
- **"Not just X, but Y."** State the point directly.
- **Rule of three.** Ideas forced into groups of three. Use the natural number.
- **Synonym cycling.** "Protagonist, main character, central figure" in one paragraph. One term for one thing; pick it and repeat it.
- **False ranges.** "from X to Y" where X and Y share no scale. List the topics directly.

### Style

- **Em dashes.** Use periods or commas instead. Parentheses and en dashes trade one tell for another; if a thought needs separation, end the sentence.
- **Colon as connector.** Colons introduce a list or example. Mid-sentence, rewrite so the point stands alone.
- **Boldface overuse.** Bold carries emphasis, not every proper noun.
- **Inline-header lists.** A bold label plus colon restating the line ("**Performance:** Performance improved...") converts to prose. A bold lead-in followed by genuinely new detail is fine.
- **Title case headings.** Use sentence case.
- **Decorative emojis.** Remove from headings and bullets.
- **Curly quotes.** Replace with straight quotes.

### Artifacts

- **Chatbot phrases.** "I hope this helps!", "Let me know if...", "Of course!", "Certainly!". Remove.
- **Sycophancy.** "Great question! You're absolutely right!" Respond directly.
- **Cutoff disclaimers.** "While specific details are limited..." Find the facts or remove the claim.

### Filler

- **Filler phrases.** "In order to" becomes "To". "Due to the fact that" becomes "Because". "It is important to note that" gets deleted.
- **Hedging stacks.** "could potentially possibly be argued that it might" becomes "may".
- **Generic conclusions.** "The future looks bright." State specific plans, or end earlier.
- **Adverbs propping weak verbs.** "runs quickly" becomes "is fast" or the number. "significantly improves" becomes the measured delta.

### Jargon

- **Abstract metaphor nouns.** Substrate, wedge, vector, locus, nexus, primitive (as noun), harness (as metaphor), surface (as in "API surface"), bedrock, scaffolding (as metaphor), modality, paradigm, ratchet (as metaphor), north star, flywheel, endgame. Each has a concrete word: "substrate" becomes "base", "wedge in" becomes "add", "endgame" becomes "the last phase".

### Plain speech

- **Feelings instead of mechanisms.** "SQL you can read" names a feeling; "`.toSQL()` returns the exact string sent to the database" names a mechanism. Restate every claim as an instruction, fact, or number. A sentence that fits another project's docs unchanged says nothing about this one; cut it.
- **Dense sentences.** If the reader backtracks to parse it, split it.

## Technical mode

Based on ASD-STE100. Call the result STE-based; claim strict conformance only after checking the current issue and dictionary.

- Put one main action in each sentence.
- Use familiar words with one precise meaning. Keep idioms and figurative language out.
- Use the exact technical term when accuracy needs it. Define it once or link the definition.
- Keep noun groups short. Show relationships with prepositions.
- Write procedures as condition, action, expected result. State what the reader must do.
- Preserve code, commands, identifiers, product names, legal text, and quotations exactly.

## Voice mode

Removing tells is half the job. Sterile prose is just as obviously machine-made.

- **Have opinions.** React to facts instead of listing pros and cons.
- **Vary rhythm.** Short sentences. Then longer ones that take their time. Here rhythm outranks one-action-per-sentence.
- **Acknowledge complexity.** "Impressive but also kind of unsettling" beats "impressive".
- **Use "I" when it fits.** First person is professional.
- **Let some mess in.** Perfect parallel structure in every paragraph looks machine-made.
- **Be specific.** Not "this is concerning" but "there's something unsettling about agents churning away at 3am".

For fiction, poetry, memoir, and scripts, keep intentional ambiguity, cadence, imagery, and character voice when they create a real effect. Remove only language that feels inherited, inflated, evasive, or lazy.
