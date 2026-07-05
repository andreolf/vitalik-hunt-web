import data from "@/data/stylometry.json";

interface Candidate {
  id: string;
  authors?: string;
  source?: string;
  created?: string;
  delta_vitalik: number;
  delta_nearest_vitalik_doc: number;
  delta_nearest_bg: number;
  nearest_bg_author?: string;
  contrast: number;
  llm_score: number;
  llm_signal: string;
  llm_against: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function titleOf(c: Candidate): string {
  const eip = c.id.match(/(eip|erc)-(\d+)/i);
  if (eip) return `${eip[1].toUpperCase()}-${eip[2]}`;
  const slug = c.id.match(/\/t\/([^/]+)\//);
  if (slug) {
    const text = slug[1].replace(/-/g, " ");
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return c.id;
}

function urlOf(c: Candidate): string {
  if (c.id.startsWith("http")) return c.id;
  const eip = c.id.match(/eip-(\d+)/i);
  if (eip) return `https://eips.ethereum.org/EIPS/eip-${eip[1]}`;
  const erc = c.id.match(/erc-(\d+)/i);
  if (erc) return `https://ercs.ethereum.org/ERCS/erc-${erc[1]}`;
  return `https://github.com/${c.id}`;
}

function sourceOf(c: Candidate): string {
  if (c.id.includes("ethresear.ch")) return "ethresear.ch";
  if (c.id.includes("ethereum-magicians")) return "Ethereum Magicians";
  if (/erc-\d+/i.test(c.id)) return "ERC";
  if (/eip-\d+/i.test(c.id)) return "EIP";
  return c.source ?? "other";
}

function dateOf(c: Candidate): string | null {
  if (!c.created) return null;
  const d = new Date(c.created);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// EIP author fields can be long lists with emails/handles; keep first name only.
function authorOf(c: Candidate): string | null {
  if (!c.authors) return null;
  const first = c.authors
    .split(",")[0]
    .replace(/[<(].*$/, "")
    .trim();
  const extra = c.authors.split(",").length - 1;
  return extra > 0 ? `${first} et al.` : first;
}

const candidates = data.top_15 as Candidate[];
const { summary, corpus } = data;

export default function Home() {
  return (
    <>
      <header>
        <h1>The Vitalik Hunt</h1>
        <p className="subtitle">
          A stylometric search for Vitalik Buterin&rsquo;s pseudonymous Ethereum
          document &middot; July 2026
        </p>
      </header>

      <main>
        <section>
          <p>
            In June 2026, Vitalik{" "}
            <a href="https://x.com/VitalikButerin/status/2069080988097876084">
              posted a challenge
            </a>
            :
          </p>
          <blockquote>
            <p>
              I&rsquo;ve published one &ldquo;medium importance&rdquo; Ethereum
              document under a pseudonym this decade. Can you find it? Day-13
              hint: people&rsquo;s searches fail to include categories of
              documents that really should be included.
            </p>
          </blockquote>
          <p>
            This page documents an attempt to find it with stylometry:{" "}
            {summary.total_candidates} candidate documents (EIPs, ERCs,
            ethresear.ch posts, Ethereum Magicians threads from 2020 onward)
            compared against {summary.reference_texts} texts Vitalik is known to
            have written, using a two-stage pipeline &mdash; Burrows&rsquo;
            Delta to rank, then an LLM judge to score the top{" "}
            {summary.top_candidates_scored}.
          </p>
        </section>

        <section>
          <h2>The answer</h2>
          <p>
            <strong>
              Our best candidate:{" "}
              <a href="https://ethresear.ch/t/privacy-preserving-nullifiers-for-proof-of-identity-applications/18551">
                Privacy-preserving nullifiers for proof-of-identity
                applications
              </a>
            </strong>
            , posted on ethresear.ch in February 2024 under the handle
            &ldquo;turboblitz&rdquo;.
          </p>
          <p>
            The reasoning goes in three steps. First, the challenge requires a
            pseudonym, which quietly eliminates most of the top 15: documents
            signed by Micah Zoltu, Greg Colvin, Ed Felten, Nick Mudge and
            other established, verifiable identities can&rsquo;t be it, and
            neither can authors like barryWhiteHat whose pseudonym is itself a
            well-known separate identity. Second, among the pseudonymous
            remainder, this post ranks first on both stages: the highest LLM
            score ({summary.highest_llm_score}/100) and a positive Delta
            contrast, meaning it sits stylometrically closer to Vitalik than
            to any of the ten background authors. Third, the subject &mdash;
            privacy-preserving identity proofs &mdash; is the theme Vitalik
            has returned to most persistently this decade, and an ethresear.ch
            protocol sketch fits &ldquo;medium importance&rdquo; better than a
            shipped EIP.
          </p>
          <p>
            Confidence: <strong>low</strong>. Even the winner scores only{" "}
            {summary.highest_llm_score}/100 on the stylistic rubric &mdash;
            nothing in the pool reads convincingly like Vitalik. If this guess
            is wrong, the likeliest reasons are that the document sits in a
            category our scrapers never touched (the day-13 hint points
            exactly there) or that it was deliberately style-laundered, which
            defeats function-word stylometry by construction.
          </p>
        </section>

        <section>
          <h2>The candidates</h2>
          <p className="muted">
            Ranked by LLM score. Click a row to see the evidence for and
            against.
          </p>
          <ol className="candidates">
            {candidates.map(c => (
              <li key={c.id}>
                <details>
                  <summary>
                    {titleOf(c)}{" "}
                    <span className="score">{c.llm_score}/100</span>
                  </summary>
                  <div className="detail">
                    <p className="muted">
                      {[authorOf(c), sourceOf(c), dateOf(c)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="muted mono">
                      &Delta; to Vitalik {c.delta_vitalik.toFixed(3)} &middot;
                      nearest background {c.delta_nearest_bg.toFixed(3)}
                      {c.nearest_bg_author
                        ? ` (${c.nearest_bg_author})`
                        : ""}{" "}
                      &middot; contrast {c.contrast >= 0 ? "+" : ""}
                      {c.contrast.toFixed(3)}
                    </p>
                    <p>
                      <em>For:</em> {c.llm_signal}
                    </p>
                    <p>
                      <em>Against:</em> {c.llm_against}
                    </p>
                    <p>
                      <a href={urlOf(c)}>source &rarr;</a>
                    </p>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2>Method</h2>
          <h3>Stage 1: Burrows&rsquo; Delta</h3>
          <p>
            Each text is represented by the relative frequencies of the 300 most
            frequent function words, z-scored across the whole pool. Delta is
            the mean absolute z-score distance between a candidate and an
            author&rsquo;s centroid &mdash; lower means stylistically closer. To
            reduce false positives from shared topics, candidates are ranked by{" "}
            <em>contrast</em>: the distance to the nearest of ten background
            authors minus the distance to Vitalik. A positive contrast means the
            text sits closer to Vitalik than to anyone else in the pool.
          </p>
          <h3>Stage 2: LLM judge</h3>
          <p>
            The top 15 by contrast were scored 0&ndash;100 by Claude against a
            rubric of Vitalik&rsquo;s stylistic tells: hedging (&ldquo;that
            said&rdquo;, &ldquo;to be clear&rdquo;, &ldquo;note that&rdquo;),
            caveat-dense sentences with em-dashes and parentheticals,
            steelmanning (&ldquo;one natural approach&hellip; but&rdquo;),
            analogies from economics and biology with back-of-envelope
            arithmetic, and casual register mixed into technical prose. Scores
            above ~40 would suggest a serious candidate; nothing here got close.
          </p>
        </section>

        <section>
          <h2>Corpus</h2>
          <p>
            Reference: {corpus.vitalik_blog_posts} posts from{" "}
            <a href="https://github.com/vbuterin/blog">vbuterin/blog</a> plus{" "}
            {corpus.vitalik_ethresear_posts} ethresear.ch posts (~1.2M tokens).
            Background: ten prolific ethresear.ch authors (
            {corpus.background_authors.join(", ")}). Candidates:{" "}
            {corpus.candidate_sources.eips_ercs} EIPs/ERCs,{" "}
            {corpus.candidate_sources.ethresear_topics} ethresear.ch topics,{" "}
            {corpus.candidate_sources.ethereum_magicians} Ethereum Magicians
            threads.
          </p>
        </section>
      </main>

      <footer>
        <p className="muted">
          Data, methodology and source:{" "}
          <a href="https://github.com/andreolf/vitalik-hunt-web">
            vitalik-hunt-web
          </a>{" "}
          &middot; July 5, 2026
        </p>
      </footer>
    </>
  );
}
