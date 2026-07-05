# 🔍 Vitalik Hunt: Stylometry Investigation Tool

> **A two-stage forensic analysis of 915 Ethereum documents to identify Vitalik Buterin's pseudonymous publication.**

🌐 **[Live Demo](https://andreolf.github.io/vitalik-hunt-web)** • 📚 **[Documentation](#-understanding-the-analysis)** • 🔬 **[Analysis Pipeline](https://github.com/andreolf/vitalik-hunt)**

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📖 Overview

In June 2026, Vitalik Buterin issued an anonymity challenge: he published one "medium importance" Ethereum document under a pseudonym and challenged the community to find it. His day-13 hint revealed that people's searches "fail to include categories of documents that really should be included."

**Vitalik Hunt** is an interactive investigation tool that applies **two-stage stylometry analysis** to narrow down the target:

1. **Stage 1: Burrows' Delta** — Contrastive function-word analysis comparing 915 candidate documents against Vitalik's known corpus (338 texts) and 10 background Ethereum authors
2. **Stage 2: LLM Judge** — Claude-Sonnet-4-6 evaluates top-15 candidates on stylistic markers (hedging, em-dashes, steelmanning, analogies, register mixing)

The website presents findings in a **dark, forensic-themed interface** designed for researchers, enthusiasts, and curious minds investigating the challenge.

---

## ✨ Features

### 🎯 Interactive Candidate Explorer
- **Top-15 candidates** ranked by Delta contrast and LLM score
- **Expandable cards** showing Delta signals, LLM analysis, and strongest arguments for/against
- **Search & filter** by document ID or source (EIP, ethresear.ch, Ethereum Magicians)
- **Direct links** to source documents for verification

### 📊 Comprehensive Methodology
- **Burrows' Delta explained** — How function-word analysis identifies authorship
- **Scoring signals breakdown** — Delta to Vitalik, nearest background author, contrast, per-document distance
- **LLM rubric details** — Stylistic markers Claude evaluates (hedging, em-dashes, steelmanning, analogies)
- **Corpus overview** — Reference texts, background authors, candidate sources

### 🎨 Dark Forensic Theme
- **High-contrast design** — Deep charcoal background (#0a0a0a), off-white text (#f5f5f5)
- **Amber accents** (#f59e0b) — Highlights key findings and top candidates
- **Monospace typography** — Courier Prime for scores, Inter for body text
- **Responsive layout** — Works on desktop, tablet, and mobile

### 🔗 Seamless Integration
- **Real analysis data** — Integrated with vitalik-hunt pipeline (stylometry.json)
- **Live source links** — Click through to ethresear.ch posts, EIPs, and ERCs
- **Metadata tags** — Source classification (EIP, ethresear.ch, etc.)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **pnpm** 10+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/andreolf/vitalik-hunt-web.git
cd vitalik-hunt-web

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The site will be available at `http://localhost:3000`.

### Build for Production

```bash
# Build optimized bundle
pnpm run build

# Preview production build locally
pnpm run preview

# Deploy to your hosting (GitHub Pages, Vercel, Netlify, etc.)
```

---

## 📁 Project Structure

```
vitalik-hunt-web/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx           # Main investigation dashboard
│   │   ├── components/
│   │   │   └── ui/                # shadcn/ui components
│   │   ├── data/
│   │   │   └── stylometry.json    # Analysis data (top-15 candidates)
│   │   ├── App.tsx                # Router & theme setup
│   │   ├── main.tsx               # React entry point
│   │   └── index.css              # Global styles & theme colors
│   ├── index.html                 # HTML template
│   └── public/                    # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Key Files

- **`client/src/pages/Home.tsx`** — Main investigation interface with hero, candidates, methodology, and corpus tabs
- **`client/src/data/stylometry.json`** — Analysis results (top-15 candidates with Delta/LLM scores)
- **`client/src/index.css`** — Dark theme colors, typography system, custom utilities

---

## 🎨 Design System

### Color Palette
| Role | Color | OKLCH |
|------|-------|-------|
| Background | Deep Charcoal | `oklch(0.08 0 0)` |
| Foreground | Off-White | `oklch(0.95 0.01 0)` |
| Accent | Amber | `oklch(0.6 0.2 45)` |
| Secondary | Dark Gray | `oklch(0.15 0.01 0)` |
| Muted | Medium Gray | `oklch(0.25 0.02 0)` |

### Typography
- **Display:** Courier Prime Bold, 48px (hero headlines)
- **Heading 1:** Inter Bold, 32px (section titles)
- **Heading 2:** Inter SemiBold, 24px (subsections)
- **Body:** Inter Regular, 16px (main text)
- **Metadata:** Inter Regular, 12px (labels, scores)
- **Code:** Courier Prime Regular, 14px (technical terms, URLs)

### Components
- **Candidate Cards** — Expandable with Delta scores, LLM analysis, source links
- **Score Badges** — Monospace numbers with color coding (amber for high scores)
- **Tabs** — Switch between Candidates, Methodology, Corpus
- **Search Input** — Filter candidates by ID or URL

---

## 📊 Understanding the Analysis

### Burrows' Delta Scoring

**Delta** measures stylometric distance using the most-frequent words (MFW) across all texts:

1. Build MFW list (top 300 words appearing in ≥3 documents)
2. Represent each text as relative frequencies over MFW
3. Z-score normalize across the full pool (background + candidates)
4. **Delta(candidate, author) = mean |z_candidate - z_author_centroid|**
   - Lower = stylistically closer
   - Typical range: 0.3–1.0

**Contrastive Score:**
```
contrast = delta_nearest_bg - delta_vitalik
```
- **Positive** = candidate closer to Vitalik than to any background author
- **Negative** = candidate closer to background authors
- Reduces false positives from topic similarity

### LLM Judge Rubric (0–100)

Claude evaluates each candidate on:

- **Hedging habits** — "that said," "to be clear," "note that," "arguably," "roughly"
- **Caveat-dense sentences** — Long sentences with em-dashes and parentheticals
- **Steelmanning** — "One natural approach... but" argument structure
- **Analogies** — From economics, biology, game theory; back-of-envelope arithmetic
- **Register mixing** — Casual language in technical prose; rhetorical questions

**Score interpretation:**
- **18–25:** High stylistic match (rare; suggests strong candidate)
- **10–17:** Moderate match (some signature markers present)
- **0–9:** Low match (lacks author's distinctive style)

---

## 🔍 Key Findings

### Top Candidate
**[Privacy-Preserving Nullifiers for Proof-of-Identity Applications](https://ethresear.ch/t/privacy-preserving-nullifiers-for-proof-of-identity-applications/18551)**
- **LLM Score:** 18/100 (highest)
- **Delta Contrast:** +0.031
- **Signal:** Uses "note that" hedging; casual technical exposition
- **Against:** Lacks em-dash parentheticals, rhetorical questions, analogy-driven argumentation

### Verdict
All top-15 candidates score **4–18 out of 100**, indicating they **lack Vitalik's signature stylistic markers**. The pseudonymous document is likely:
- **Outside the current candidate pool** (missed by scrapers or URL lists)
- **Deliberately style-laundered** (run through an LLM or rewritten to obscure authorship)
- **Buried deeper in the ranking** (below top-15; requires manual inspection)

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 19 | Component-based interface |
| **Styling** | Tailwind CSS 4 | Utility-first styling with OKLCH colors |
| **Components** | shadcn/ui | Pre-built, accessible UI primitives |
| **Routing** | Wouter | Lightweight client-side routing |
| **Language** | TypeScript 5.6 | Type-safe development |
| **Build Tool** | Vite 7 | Fast development server & bundling |
| **Package Manager** | pnpm 10 | Fast, disk-efficient package management |

---

## 📝 Data Source

The analysis data (`stylometry.json`) comes from the **vitalik-hunt pipeline**:

- **Reference Corpus:** 330 blog posts from [vbuterin/blog](https://github.com/vbuterin/blog) + 8 ethresear.ch posts
- **Background Authors:** 10 prolific ethresear.ch writers (JustinDrake, dankrad, barnabe, mikeneuder, fradamt, lightclient, potuz, adiasg, terencechain, hwwhww)
- **Candidates:** 915 documents (801 EIPs/ERCs, 107 ethresear.ch topics, 7 Ethereum Magicians)

For the full analysis pipeline, see [vitalik-hunt](https://github.com/andreolf/vitalik-hunt).

---

## 🚀 Deployment

### GitHub Pages

✅ **Already deployed!** Access the live site at:

🌐 **[https://andreolf.github.io/vitalik-hunt-web](https://andreolf.github.io/vitalik-hunt-web)**

The site is automatically built and deployed from the `main` branch. Any push to `main` triggers a new deployment.

**To deploy your own fork:**
1. Go to **Settings → Pages**
2. Select `main` branch as source
3. GitHub will build and deploy automatically
4. Access at `https://yourusername.github.io/vitalik-hunt-web`

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm run build
EXPOSE 3000
CMD ["pnpm", "start"]
```

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- **Full ranking explorer** — Load all 915 candidates for deep research
- **Score visualizations** — Bar charts, heatmaps for Delta/LLM comparisons
- **Evidence timeline** — Cross-reference candidates with Vitalik's June 2026 activity
- **Style analysis tools** — Interactive hedging/em-dash detector
- **Export functionality** — Download analysis as CSV/JSON

To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Vitalik Buterin** for the anonymity challenge and inspiration
- **Ethereum Research** (ethresear.ch) for the research community
- **shadcn/ui** for the component library
- **Tailwind Labs** for the CSS framework

---

## 📞 Support & Questions

- **Issues:** [GitHub Issues](https://github.com/andreolf/vitalik-hunt-web/issues)
- **Discussions:** [GitHub Discussions](https://github.com/andreolf/vitalik-hunt-web/discussions)
- **Related:** [vitalik-hunt pipeline](https://github.com/andreolf/vitalik-hunt)

---

## 🔗 Related Resources

- [Vitalik Buterin's Blog](https://vitalik.eth.limo)
- [Ethereum Research (ethresear.ch)](https://ethresear.ch)
- [Ethereum Improvement Proposals (EIPs)](https://eips.ethereum.org)
- [Burrows' Delta (Authorship Attribution)](https://en.wikipedia.org/wiki/Authorship_attribution)

---

<div align="center">

**Made with 🔍 and ❤️ for the Ethereum community**

[⭐ Star this repo](https://github.com/andreolf/vitalik-hunt-web) if you find it useful!

</div>
