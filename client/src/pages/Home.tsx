import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ExternalLink, Search } from "lucide-react";
import stylometryData from "@/data/stylometry.json";

interface Candidate {
  id: string;
  delta_vitalik: number;
  delta_nearest_bg: number;
  contrast: number;
  delta_nearest_vitalik_doc: number;
  llm_score: number;
  llm_signal: string;
  llm_against: string;
  nearest_bg_author?: string;
}

export default function Home() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const candidates = stylometryData.top_15 as Candidate[];
    if (searchTerm.trim()) {
      setFilteredCandidates(
        candidates.filter((c) =>
          c.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCandidates(candidates);
    }
  }, [searchTerm]);

  const topCandidate = stylometryData.top_15[0] as Candidate;
  const getSourceBadge = (id: string) => {
    if (id.includes("ethresear.ch")) return "ethresear.ch";
    if (id.includes("eip-")) return "EIP";
    if (id.includes("erc-")) return "ERC";
    if (id.includes("ethereum-magicians")) return "Magicians";
    return "Other";
  };

  const getScoreColor = (score: number) => {
    if (score >= 15) return "text-amber-400";
    if (score >= 10) return "text-amber-300";
    return "text-slate-400";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold font-mono text-accent">◆</div>
            <div>
              <h1 className="text-lg font-bold">Vitalik Hunt</h1>
              <p className="text-xs text-muted-foreground">
                Stylometry Investigation
              </p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#methodology" className="hover:text-accent transition">
              Methodology
            </a>
            <a href="#candidates" className="hover:text-accent transition">
              Candidates
            </a>
            <a href="#about" className="hover:text-accent transition">
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-secondary/50">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4 leading-tight">
              The Evidence So Far
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              A two-stage stylometry analysis of 915 Ethereum documents to find
              Vitalik Buterin's pseudonymous "medium importance" publication.
            </p>

            {/* Top Candidate Highlight */}
            <Card className="bg-card border border-accent/30 p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    HIGHEST LLM SCORE
                  </p>
                  <h3 className="text-lg font-mono font-bold text-accent mb-2">
                    {topCandidate.id.substring(0, 80)}
                    {topCandidate.id.length > 80 ? "..." : ""}
                  </h3>
                </div>
                <Badge variant="outline" className="text-accent">
                  {getSourceBadge(topCandidate.id)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">LLM Score</p>
                  <p className={`text-2xl font-mono font-bold ${getScoreColor(topCandidate.llm_score)}`}>
                    {topCandidate.llm_score}/100
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contrast</p>
                  <p className="text-xl font-mono font-bold text-foreground">
                    +{topCandidate.contrast.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Delta (Vitalik)</p>
                  <p className="text-xl font-mono font-bold text-foreground">
                    {topCandidate.delta_vitalik.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Nearest Doc</p>
                  <p className="text-xl font-mono font-bold text-foreground">
                    {topCandidate.delta_nearest_vitalik_doc.toFixed(3)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-foreground mb-3">
                <strong>Signal:</strong> {topCandidate.llm_signal}
              </p>
              <p className="text-sm text-slate-400">
                <strong>Against:</strong> {topCandidate.llm_against}
              </p>

              <a
                href={topCandidate.id}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-accent hover:text-accent/80 transition"
              >
                View Source <ExternalLink className="w-4 h-4" />
              </a>
            </Card>

            {/* Key Finding */}
            <div className="bg-destructive/10 border border-destructive/30 rounded p-4">
              <p className="text-sm text-foreground">
                <strong>Key Finding:</strong> All top-15 candidates score{" "}
                <strong>4–18 out of 100</strong> on the LLM rubric, indicating
                they lack Vitalik's signature stylistic markers. The target
                document may be{" "}
                <em>outside the current candidate pool, deliberately obfuscated, or buried deeper in the ranking.</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
            <TabsTrigger value="corpus">Corpus</TabsTrigger>
          </TabsList>

          {/* Candidates Tab */}
          <TabsContent value="candidates" id="candidates" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Top 15 Candidates</h3>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by ID or URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>

              {/* Candidate List */}
              <div className="space-y-3">
                {filteredCandidates.map((candidate, idx) => (
                  <Card
                    key={idx}
                    className="bg-card border border-border p-4 cursor-pointer hover:border-accent/50 transition"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === idx ? null : idx)
                    }
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{idx + 1}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getSourceBadge(candidate.id)}
                          </Badge>
                        </div>
                        <p className="text-sm font-mono text-muted-foreground break-all">
                          {candidate.id}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <p className={`text-2xl font-mono font-bold ${getScoreColor(candidate.llm_score)}`}>
                          {candidate.llm_score}
                        </p>
                        <p className="text-xs text-muted-foreground">LLM</p>
                      </div>
                    </div>

                    {/* Scores Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-secondary/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">Contrast</p>
                        <p className="text-sm font-mono font-bold text-accent">
                          +{candidate.contrast.toFixed(3)}
                        </p>
                      </div>
                      <div className="bg-secondary/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">Delta V</p>
                        <p className="text-sm font-mono font-bold">
                          {candidate.delta_vitalik.toFixed(3)}
                        </p>
                      </div>
                      <div className="bg-secondary/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">Nearest</p>
                        <p className="text-sm font-mono font-bold">
                          {candidate.delta_nearest_vitalik_doc.toFixed(3)}
                        </p>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {expandedIndex === idx && (
                      <div className="border-t border-border pt-4 mt-4 space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            STRONGEST SIGNAL
                          </p>
                          <p className="text-sm text-foreground">
                            {candidate.llm_signal}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            ARGUMENT AGAINST
                          </p>
                          <p className="text-sm text-slate-400">
                            {candidate.llm_against}
                          </p>
                        </div>
                        {candidate.nearest_bg_author && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              NEAREST BACKGROUND AUTHOR
                            </p>
                            <p className="text-sm font-mono">
                              {candidate.nearest_bg_author}
                            </p>
                          </div>
                        )}
                        <a
                          href={candidate.id}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition text-sm mt-2"
                        >
                          View Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Expand Indicator */}
                    <div className="flex justify-center">
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition ${expandedIndex === idx ? "rotate-180" : ""}`}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Methodology Tab */}
          <TabsContent value="methodology" id="methodology" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Methodology</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold mb-2">Two-Stage Pipeline</h4>
                  <div className="space-y-3">
                    <div className="bg-secondary/50 rounded p-4 border border-border">
                      <p className="font-bold text-accent mb-1">
                        Stage 1: Burrows' Delta
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Contrastive function-word analysis comparing each
                        candidate to Vitalik's centroid and 10 background
                        authors. Scores based on how much closer the candidate
                        sits to Vitalik than to anyone else.
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded p-4 border border-border">
                      <p className="font-bold text-accent mb-1">
                        Stage 2: LLM Judge
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Claude-Sonnet-4-6 evaluates top-15 candidates on
                        stylistic markers: hedging, em-dashes, steelmanning,
                        analogies, and register mixing. Scores 0–100.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-2">Scoring Signals</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>delta_vitalik:</strong> Mean absolute Z-score
                      distance from Vitalik centroid (lower = closer)
                    </p>
                    <p>
                      <strong>delta_nearest_bg:</strong> Distance to nearest
                      background author centroid
                    </p>
                    <p>
                      <strong>contrast:</strong> delta_nearest_bg - delta_vitalik
                      (positive = closer to Vitalik than to anyone else)
                    </p>
                    <p>
                      <strong>delta_nearest_vitalik_doc:</strong> Distance to
                      single closest individual Vitalik document
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-2">LLM Rubric</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Claude evaluates on:
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                    <li>Hedging habits (that said, to be clear, note that)</li>
                    <li>
                      Caveat-dense long sentences with em-dashes and
                      parentheticals
                    </li>
                    <li>"One natural approach... but" argument structure</li>
                    <li>Analogies from economics, biology, game theory</li>
                    <li>Casual register mixed into technical prose</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Corpus Tab */}
          <TabsContent value="corpus" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Corpus Overview</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-bold mb-4">Reference Corpus</h4>
                  <div className="space-y-3">
                    <div className="bg-secondary/50 rounded p-4 border border-border">
                      <p className="text-2xl font-mono font-bold text-accent mb-1">
                        {stylometryData.corpus.vitalik_blog_posts}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Blog posts from vbuterin/blog
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded p-4 border border-border">
                      <p className="text-2xl font-mono font-bold text-accent mb-1">
                        {stylometryData.corpus.vitalik_ethresear_posts}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ethresear.ch posts by vbuterin
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded p-4 border border-border">
                      <p className="text-2xl font-mono font-bold text-accent mb-1">
                        338
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total reference texts (~1.2M tokens)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-4">Candidate Pool</h4>
                  <div className="space-y-3">
                    <div className="bg-secondary/50 rounded p-4 border border-border">
                      <p className="text-2xl font-mono font-bold text-accent mb-1">
                        {stylometryData.corpus.candidate_sources.eips_ercs}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        EIPs/ERCs (2020+)
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded p-4 border border-border">
                      <p className="text-2xl font-mono font-bold text-accent mb-1">
                        {stylometryData.corpus.candidate_sources.ethresear_topics}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ethresear.ch topics (non-vbuterin)
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded p-4 border border-border">
                      <p className="text-2xl font-mono font-bold text-accent mb-1">
                        {stylometryData.summary.total_candidates}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total candidates analyzed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-bold mb-4">Background Authors</h4>
                <div className="bg-secondary/50 rounded p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    10 prolific ethresear.ch writers used as contrastive
                    baseline:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stylometryData.corpus.background_authors.map((author) => (
                      <Badge key={author} variant="outline">
                        {author}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50 mt-16">
        <div className="container py-8 text-sm text-muted-foreground">
          <p>
            Stylometry analysis by vitalik-hunt pipeline • Analysis date: July
            5, 2026
          </p>
          <p className="mt-2">
            Source:{" "}
            <a
              href="https://github.com/vbuterin/blog"
              className="text-accent hover:underline"
            >
              vbuterin/blog
            </a>
            {" • "}
            <a
              href="https://ethresear.ch"
              className="text-accent hover:underline"
            >
              ethresear.ch
            </a>
            {" • "}
            <a
              href="https://github.com/ethereum/EIPs"
              className="text-accent hover:underline"
            >
              ethereum/EIPs
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
