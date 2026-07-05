# The Vitalik Hunt

A stylometric search for Vitalik Buterin's pseudonymous Ethereum document.

**Live:** https://andreolf.github.io/vitalik-hunt-web

## The challenge

In June 2026 Vitalik [posted](https://x.com/VitalikButerin/status/2069080988097876084):

> I've published one "medium importance" Ethereum document under a pseudonym this decade. Can you find it? Day-13 hint: people's searches fail to include categories of documents that really should be included.

This repo is the presentation layer for one attempt at finding it. The analysis itself ran offline; its output is committed as a static snapshot in [`client/src/data/stylometry.json`](client/src/data/stylometry.json), so every number on the site is reproducible from that file.

## Methodology

The approach is authorship attribution: don't search for the document, search for the *author's fingerprint* in a large candidate pool.

### 1. Corpus construction

| Set | Contents | Size |
|---|---|---|
| Reference (Vitalik) | Posts from [vbuterin/blog](https://github.com/vbuterin/blog) + his ethresear.ch posts | 330 + 8 texts, ~1.2M tokens |
| Background authors | Ten prolific ethresear.ch writers: JustinDrake, dankrad, barnabe, mikeneuder, fradamt, lightclient, potuz, adiasg, terencechain, hwwhww | 10 author corpora |
| Candidates | EIPs/ERCs (801), ethresear.ch topics not by vbuterin (107), Ethereum Magicians threads (7), all from 2020 onward | 915 documents |

The background set exists because raw similarity to Vitalik is confounded by topic: everyone on ethresear.ch writes about the same things. The question is never "is this close to Vitalik?" but "is this *closer to Vitalik than to anyone else who writes about this*?"

### 2. Stage 1 — Burrows' Delta (contrastive ranking)

Classic function-word stylometry:

1. Build the most-frequent-word list (top 300 words appearing in ≥3 documents) across the full pool.
2. Represent each text as relative frequencies over that list, z-scored across the pool.
3. `delta(text, author) = mean |z_text − z_author_centroid|` — lower is stylistically closer.

For each candidate we compute:

- `delta_vitalik` — distance to Vitalik's centroid
- `delta_nearest_vitalik_doc` — distance to the single closest Vitalik document (catches style drift across his corpus)
- `delta_nearest_bg` — distance to the nearest background-author centroid
- **`contrast = delta_nearest_bg − delta_vitalik`** — the ranking key. Positive means the text sits closer to Vitalik than to any background author.

Function words (the, of, that, which…) are hard to fake and mostly topic-independent, which is why Delta has survived 25 years of authorship-attribution research.

### 3. Stage 2 — signature-feature extraction

Independently of Delta, each candidate gets a vector of ~30 handcrafted features tuned to Vitalik's known tells (all present per candidate in `stylometry.json` under `signature_features`):

- **Hedging/discourse markers** — occurrence rates of "that said", "to be clear", "note that", "in practice", "of course", "arguably", "roughly", "one natural…", "why not just", "it turns out", "the key question", "first of all"
- **Concept vocabulary** — "tradeoff", "incentive", "adversar-", "coordination", "griefing", "quadratic", "orders of magnitude", "naive"
- **Punctuation rates** — em-dashes, parentheticals, semicolons, colons, question marks, exclamations, scare quotes
- **Sentence statistics** — mean length, long-sentence and short-sentence ratios, type-token ratio over a 2k-token window

### 4. Stage 3 — LLM judge

The top 15 candidates by contrast were scored 0–100 by Claude Sonnet 4.6 against a rubric of Vitalik's stylistic signature:

- hedging habits ("that said", "to be clear", "note that")
- caveat-dense long sentences with em-dashes and parentheticals
- steelmanning structure ("one natural approach… but")
- analogies from economics/biology/game theory, back-of-envelope arithmetic
- casual register mixed into technical prose, rhetorical questions

For each candidate the judge produced a score plus the strongest argument *for* and *against* attribution — both are displayed on the site, so the negative evidence is as visible as the positive.

**What this was and wasn't:** a single-pass pipeline — scrape → Delta rank → feature extraction → one LLM judging pass per candidate. No agentic search loop, no iterative pool expansion, no tool-using agents. That is the most obvious upgrade path (see below).

## Results

All top-15 candidates score **4–18 out of 100**. Nothing reads like Vitalik. Given the day-13 hint ("searches fail to include categories of documents that really should be included"), the most likely explanation is that the document isn't in this pool at all. Alternatives: it was deliberately style-laundered (e.g. LLM-rewritten, which defeats function-word stylometry), or it sits below the top-15 cutoff.

A negative result with a working method is still useful: the pipeline is reusable on any expanded pool.

## Limitations and next steps

- **Pool coverage is the binding constraint.** Missing categories worth adding: ethereum.org docs, EF blog, DAO governance forums, audit reports, Chinese-language Ethereum documents, hackathon writeups, wiki edits.
- **Agent-loop search** — let an agent iteratively propose document categories from the hint, scrape them, re-run the pipeline, and inspect outliers, instead of the current fixed single pass.
- **Delta is unstable on short texts** (< ~1,500 words), which penalizes short EIPs.
- **LLM judging was one pass per document** with no cross-candidate calibration; pairwise comparison or ensembling would be more robust.
- **Style laundering is undetectable by this method** by construction. If the document was machine-rewritten, only metadata (timing, topic, wallet/account forensics) would find it.

## The site

Deliberately minimal, in the spirit of [vitalik.eth.limo](https://vitalik.eth.limo): one text column, system serif, native `<details>` disclosure, no component library, no analytics, ~1KB of CSS. React + Vite.

```bash
pnpm install
pnpm dev        # dev server on :3000
pnpm check      # typecheck
pnpm build      # outputs to dist/public
```

### Deployment

GitHub Pages serves the `main` branch root; the build output is committed at the repo root:

```bash
pnpm build
rm -rf assets index.html
cp -r dist/public/assets assets && cp dist/public/index.html index.html
```

The Vite base is `./` so the build works at any path.

## License

MIT
