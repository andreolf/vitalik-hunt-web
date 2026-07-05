# The Vitalik Hunt

A stylometric search for Vitalik Buterin's pseudonymous Ethereum document.

**Live:** https://andreolf.github.io/vitalik-hunt-web

## Background

In June 2026 Vitalik [posted a challenge](https://x.com/VitalikButerin/status/2069080988097876084):

> I've published one "medium importance" Ethereum document under a pseudonym this decade. Can you find it? Day-13 hint: people's searches fail to include categories of documents that really should be included.

This site presents the results of a two-stage analysis of 915 candidate documents (EIPs, ERCs, ethresear.ch topics, Ethereum Magicians threads from 2020 onward) against 338 texts Vitalik is known to have written:

1. **Burrows' Delta** — function-word frequency analysis. Candidates are ranked by _contrast_: distance to the nearest of ten background authors minus distance to Vitalik. Positive contrast means the text sits closer to Vitalik than to anyone else in the pool.
2. **LLM judge** — the top 15 by contrast are scored 0–100 against a rubric of Vitalik's stylistic tells (hedging, em-dash parentheticals, steelmanning, economics/biology analogies, register mixing).

**Result so far:** all top-15 candidates score 4–18/100. The document is probably outside the candidate pool, style-laundered, or buried below the top 15.

The analysis pipeline lives at [andreolf/vitalik-hunt](https://github.com/andreolf/vitalik-hunt). This repo is just the presentation layer; the data is a static snapshot in `client/src/data/stylometry.json`.

## Design

Deliberately minimal, in the spirit of [vitalik.eth.limo](https://vitalik.eth.limo): one text column, system serif, native `<details>` elements for candidate expansion, no component library, no icons, no analytics. React + Vite + ~1KB of CSS.

## Development

```bash
pnpm install
pnpm dev        # dev server on :3000
pnpm check      # typecheck
pnpm build      # outputs to dist/public
```

## Deployment

GitHub Pages serves the `main` branch root. The build output is committed at the repo root (`index.html` + `assets/`):

```bash
pnpm build
rm -rf assets index.html
cp -r dist/public/assets assets && cp dist/public/index.html index.html
```

The Vite base is `./` so the build works at any path.

## License

MIT
