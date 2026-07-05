# Vitalik Hunt: Investigation Tool Design

## Design Philosophy: "Forensic Elegance"

This is a **technical investigation interface** for stylometry analysis—a tool for researchers and enthusiasts to explore the evidence behind Vitalik Buterin's anonymity challenge. The design should feel **scientific, authoritative, and exploratory**, not marketing-focused.

**Core Aesthetic:** Dark, minimalist interface with high contrast for readability. Emphasis on data clarity, typography hierarchy, and subtle interactive feedback. Think: research lab dashboard, not SaaS landing page.

---

## Chosen Approach: Forensic Elegance

**Design Movement:** Contemporary data visualization + minimalist brutalism. Inspired by academic research tools, forensic analysis dashboards, and technical documentation sites.

**Core Principles:**
1. **Data-first layout** — Information hierarchy drives structure; no decorative elements
2. **High contrast typography** — Bold headings (Courier Prime for code/technical terms), readable body text (Inter)
3. **Monochromatic with accent** — Dark background (#0a0a0a), white text, single accent color (amber/gold #f59e0b for highlights)
4. **Sparse whitespace** — Generous padding around sections; breathing room for focus
5. **Technical authenticity** — Subtle grid backgrounds, code-like typography for scores, minimal shadows

**Color Philosophy:**
- **Background:** Deep charcoal (#0a0a0a) — feels like a terminal, authoritative
- **Text:** Off-white (#f5f5f5) — high contrast, easy on eyes
- **Accent:** Amber (#f59e0b) — draws attention to key findings (top candidates, high scores)
- **Secondary:** Slate (#64748b) — for metadata, timestamps, less important info
- **Danger:** Red (#ef4444) — for low scores, warnings

**Layout Paradigm:**
- **Hero section:** Full-width dark background with large typography. Headline + key finding (top candidate).
- **Two-column grid:** Left = methodology/corpus overview. Right = interactive explorer.
- **Card-based candidates:** Each top-15 candidate is a card with Delta score, LLM score, and expandable details.
- **Sticky sidebar:** Navigation to jump between sections (Summary, Methodology, Top Candidates, Explorer).

**Signature Elements:**
1. **Score badges:** Large, monospaced numbers (Delta contrast, LLM score) with subtle background tint
2. **Comparison bars:** Visual representation of Delta scores (contrast bar, dV bar) — horizontal bars with gradient fill
3. **Metadata tags:** Small pills showing source (EIP, ethresear.ch, etc.) and category

**Interaction Philosophy:**
- **Hover states:** Subtle background tint, slight shadow lift
- **Expandable cards:** Click to reveal full LLM signal + against arguments
- **Smooth transitions:** 200ms ease-out for card expansion, 150ms for hover states
- **Keyboard navigation:** Tab through candidates, Enter to expand

**Animation:**
- Cards fade in on scroll (staggered by 50ms)
- Score bars animate from 0 to final value on load (600ms ease-out)
- Hover: subtle scale (1.02) + shadow lift
- No unnecessary motion; respect `prefers-reduced-motion`

**Typography System:**
- **Display:** Courier Prime Bold, 48px (hero headline)
- **Heading 1:** Inter Bold, 32px (section titles)
- **Heading 2:** Inter SemiBold, 24px (subsection titles)
- **Body:** Inter Regular, 16px (main text)
- **Metadata:** Inter Regular, 12px (scores, labels)
- **Code:** Courier Prime Regular, 14px (technical terms, URLs)

**Brand Essence:**
*A transparent, forensic investigation tool for stylometry analysis. For researchers, enthusiasts, and curious minds. Different because it prioritizes evidence over narrative.*

**Brand Voice:**
- Headlines: Direct, technical, intriguing ("The Evidence So Far", "Why This Candidate Scores Low")
- CTAs: Action-oriented ("Explore Full Ranking", "View Methodology")
- Microcopy: Precise, no fluff ("Contrast score: how much closer to Vitalik than to background authors")

Example lines:
- "18 out of 100. The highest score yet—but still far from a match."
- "All candidates lack the dense em-dash parentheticals that define Vitalik's prose."

**Logo/Mark:**
A simple, bold icon: a magnifying glass overlaid with a waveform (representing stylometry analysis). Monochromatic, works at any size. No text, just the symbol.

**Signature Brand Color:**
Amber (#f59e0b) — draws attention to key findings without being garish. Pairs well with dark background.

---

## Style Decisions

- **No rounded corners on cards** — Use sharp 4px radius for technical feel
- **Monospace for all scores** — Courier Prime for Delta/LLM numbers
- **Sticky header with logo + nav** — Always visible, dark background
- **Full-width hero** — Dramatic intro with top candidate highlighted
- **Two-column layout below hero** — Methodology on left, explorer on right
- **Expandable candidate cards** — Click to reveal full analysis
- **Gradient score bars** — Visual representation of Delta/LLM scores
- **No animations on load** — Instant display, animations only on interaction
- **Minimal shadows** — Only on hover/active states
- **Code blocks for URLs** — Monospace, background tint for technical URLs

---

## Pages

1. **Home / Investigation Dashboard**
   - Hero: "Vitalik Hunt: Stylometry Investigation"
   - Top candidate card (highlighted in amber)
   - Two-column: Methodology + Explorer
   - Sticky sidebar for navigation

2. **Methodology** (scrollable section)
   - Corpus overview (reference texts, background authors)
   - Scoring signals explained (Delta, LLM)
   - Candidate sources breakdown

3. **Top Candidates** (scrollable section)
   - Full top-15 table with expandable rows
   - Filter by source (EIP, ethresear.ch, etc.)
   - Sort by Delta score, LLM score, or contrast

4. **Explorer** (interactive section)
   - Search candidates by ID or URL
   - Detailed view with all signals
   - Related candidates (similar Delta score)

---

## Visual Assets

- **Hero background:** Subtle grid pattern or abstract waveform (generated)
- **Logo:** Magnifying glass + waveform icon (generated)
- **Score visualization:** Horizontal bars with gradient (CSS)
- **Accent elements:** Amber highlights, subtle borders

---

## Responsive Design

- **Desktop (1024px+):** Two-column layout, sticky sidebar
- **Tablet (768px–1023px):** Single column, collapsible sidebar
- **Mobile (< 768px):** Full-width cards, hamburger menu, stacked layout
