"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Zap,
  Workflow,
  Puzzle,
  DollarSign,
  ArrowRight,
  Play,
  Code,
  Webhook,
  Bot,
  GitBranch,
  Shield,
  Clock,
  Users,
  Check,
  Sparkles,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Animated pixel background component
function PixelBackground() {
  const [pixels, setPixels] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const newPixels = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }));
    setPixels(newPixels);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Animated pixels */}
      {pixels.map((pixel) => (
        <div
          key={pixel.id}
          className="absolute w-2 h-2 bg-blue-400/20 dark:bg-blue-400/30 rounded-sm animate-pulse"
          style={{
            left: `${pixel.x}%`,
            top: `${pixel.y}%`,
            animationDelay: `${pixel.delay}s`,
            animationDuration: `${pixel.duration}s`,
          }}
        />
      ))}
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-sky-400/10 dark:bg-sky-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
    </div>
  );
}

// Pricing tiers configuration
const PRICING_TIERS = [
  { credits: 500, proPrice: 9, businessPrice: 19 },
  { credits: 1000, proPrice: 15, businessPrice: 29 },
  { credits: 2500, proPrice: 29, businessPrice: 49 },
  { credits: 5000, proPrice: 49, businessPrice: 79 },
  { credits: 10000, proPrice: 79, businessPrice: 129 },
  { credits: 25000, proPrice: 149, businessPrice: 229 },
  { credits: 50000, proPrice: 249, businessPrice: 399 },
];

function PricingSection() {
  const [selectedTierIndex, setSelectedTierIndex] = useState(2); // Default to 2,500 credits
  const selectedTier = PRICING_TIERS[selectedTierIndex];

  const formatCredits = (credits: number) => {
    return credits >= 1000 ? `${(credits / 1000).toFixed(credits % 1000 === 0 ? 0 : 1)}k` : credits.toString();
  };

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Simple pricing. Unlimited potential.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that matches your ambition. Every tier unlocks more power.
          </p>
        </div>

        {/* Credits explainer */}
        <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 rounded-xl p-6 mb-8 max-w-3xl mx-auto">
          <h4 className="font-semibold text-foreground mb-3">Quick credit math:</h4>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Logic & transforms: <strong className="text-foreground">1 credit</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">AI processing: <strong className="text-foreground">10 credits</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Webhook triggers: <strong className="text-foreground">1 credit</strong></span>
            </div>
          </div>
        </div>

        {/* Credits Slider - Above Cards */}
        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-sm font-medium text-muted-foreground text-center mb-4">Select your monthly credits</p>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max={PRICING_TIERS.length - 1}
              value={selectedTierIndex}
              onChange={(e) => setSelectedTierIndex(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-4">
              {PRICING_TIERS.map((tier, index) => (
                <button
                  key={tier.credits}
                  onClick={() => setSelectedTierIndex(index)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    index === selectedTierIndex
                      ? "bg-blue-600 text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {formatCredits(tier.credits)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Free</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-4">500 credits/month</p>
            <p className="text-muted-foreground text-sm mb-6">Perfect for getting started. No strings attached.</p>

            <div className="space-y-3 mb-6">
              <ul className="space-y-2">
                {[
                  "3 workflows",
                  "4 nodes per workflow",
                  "Input, Logic, API & Output nodes",
                  "Community support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-foreground text-sm">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Not included:</p>
                <ul className="space-y-2">
                  {[
                    "AI nodes",
                    "Webhook triggers",
                    "App integrations",
                    "Import/Export",
                    "AI chatbot",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground text-sm">
                      <X className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              href="/workflow"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center bg-muted hover:bg-muted/80 text-foreground font-medium rounded-xl transition-colors text-sm"
            >
              Try It Out
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="rounded-2xl border-2 border-blue-500 bg-card p-6 relative shadow-xl shadow-blue-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
              Most Popular
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Pro</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-foreground">${selectedTier.proPrice}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-4">
              {selectedTier.credits.toLocaleString()} credits/month
            </p>
            <p className="text-muted-foreground text-sm mb-6">For serious builders who want the full toolkit.</p>

            <div className="space-y-3 mb-6">
              <p className="text-xs font-medium text-foreground">Everything in Free, plus:</p>
              <ul className="space-y-2">
                {[
                  "10 workflows",
                  "25 nodes per workflow",
                  "AI nodes (GPT-4, Claude)",
                  "Webhook triggers",
                  "App integrations",
                  "Import/Export workflows",
                  "AI chatbot assistant",
                  "Email support",
                  "Credit rollover",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-foreground text-sm">
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/workflow"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md text-sm"
            >
              Get Pro
            </Link>
          </div>

          {/* Business Tier */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Business</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-foreground">${selectedTier.businessPrice}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-4">
              {selectedTier.credits.toLocaleString()} credits/month
            </p>
            <p className="text-muted-foreground text-sm mb-6">For teams that need no limits and priority support.</p>

            <div className="space-y-3 mb-6">
              <p className="text-xs font-medium text-foreground">Everything in Pro, plus:</p>
              <ul className="space-y-2">
                {[
                  "Unlimited workflows",
                  "Unlimited nodes per workflow",
                  "Team collaboration",
                  "Advanced analytics",
                  "Custom integrations",
                  "Priority execution",
                  "Priority support",
                  "Dedicated account manager",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-foreground text-sm">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/workflow"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center bg-muted hover:bg-muted/80 text-foreground font-medium rounded-xl transition-colors text-sm"
            >
              Get Business
            </Link>
          </div>
        </div>

        {/* Enterprise callout */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need 100,000+ credits, custom SLAs, or on-premise deployment?{" "}
            <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Let&apos;s talk Enterprise
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

// Animated workflow node component
function AnimatedNode({
  children,
  delay = 0,
  className = ""
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Animated connection line
function AnimatedConnection({ delay = 0 }: { delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="relative h-8 flex items-center justify-center">
      <div
        className={`w-0.5 bg-gradient-to-b from-blue-300 to-blue-400 transition-all duration-500 ease-out ${
          isVisible ? "h-8" : "h-0"
        }`}
      />
      <div
        className={`absolute bottom-0 w-2 h-2 bg-blue-400 rounded-full transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        style={{ transitionDelay: "300ms" }}
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Flowys</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/tutorial" className="text-muted-foreground hover:text-foreground transition-colors">
              Tutorial
            </Link>
            <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/workflow"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/30 dark:to-background relative overflow-hidden">
        <PixelBackground />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            The visual AI automation platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Stop wasting time.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Start automating.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Connect AI, APIs, and logic into workflows that run themselves.
            What used to take days of coding now takes minutes of clicking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/workflow"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg shadow-blue-500/25"
            >
              <Play className="w-5 h-5" />
              Start Building
            </Link>
            <Link
              href="/tutorial"
              className="w-full sm:w-auto px-8 py-4 bg-background hover:bg-muted border border-border text-foreground font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-sm"
            >
              <Play className="w-5 h-5" />
              See It in Action
            </Link>
          </div>
        </div>

        {/* Animated Visual Preview */}
        <div className="max-w-6xl mx-auto mt-16 relative z-10">
          <div className="relative rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-2 shadow-2xl shadow-blue-500/10">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl opacity-20 blur-sm" />
            <div className="relative rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-blue-950/50 p-8 min-h-[400px] flex items-center justify-center overflow-hidden">
              {/* Inner grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #3b82f6 1px, transparent 1px),
                    linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="flex items-center gap-8 relative">
                {/* Sample workflow nodes with animations */}
                <div className="flex flex-col items-center">
                  <AnimatedNode delay={200}>
                    <div className="px-6 py-4 bg-background border-2 border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-3 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-300 cursor-default">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                        <Webhook className="w-5 h-5" />
                      </div>
                      <span>Webhook Trigger</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </AnimatedNode>
                  <AnimatedConnection delay={500} />
                  <AnimatedNode delay={800}>
                    <div className="px-6 py-4 bg-background border-2 border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300 font-medium flex items-center gap-3 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 cursor-default">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </div>
                      <span>AI Process</span>
                      <div className="flex gap-0.5">
                        <div className="w-1.5 h-3 bg-blue-400 rounded-full animate-pulse" />
                        <div className="w-1.5 h-3 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-3 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </AnimatedNode>
                  <AnimatedConnection delay={1100} />
                  <AnimatedNode delay={1400}>
                    <div className="px-6 py-4 bg-background border-2 border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-300 font-medium flex items-center gap-3 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-105 transition-all duration-300 cursor-default">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                        <Code className="w-5 h-5" />
                      </div>
                      <span>Transform Data</span>
                    </div>
                  </AnimatedNode>
                </div>

                <AnimatedNode delay={1700} className="flex items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full" />
                    <ArrowRight className="w-6 h-6 text-blue-400 animate-pulse" />
                  </div>
                </AnimatedNode>

                <AnimatedNode delay={2000}>
                  <div className="px-8 py-6 bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-400 rounded-xl text-white font-medium flex items-center gap-3 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-default">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-blue-100 text-xs uppercase tracking-wide">Output</div>
                      <div className="text-lg">Automated Result</div>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-ping" />
                  </div>
                </AnimatedNode>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-6 border-y border-border">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Puzzle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Zero learning curve</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you can draw a flowchart, you can build a workflow. Drag nodes, connect them, hit run. That&apos;s it.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Workflow className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">AI that actually works</h3>
            <p className="text-muted-foreground leading-relaxed">
              Summarize documents, extract data, generate content, or make decisions. Add AI to any step with one click.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Pay for what you use</h3>
            <p className="text-muted-foreground leading-relaxed">
              No per-user fees. No surprises. Simple credit-based pricing that scales with your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful enough for enterprise. Simple enough to start today.
              Built for teams who ship fast.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: "AI-Powered Nodes",
                description: "GPT-4, Claude, or your own models. Summarize, analyze, generate, or decide—all in one node.",
                color: "blue",
              },
              {
                icon: Webhook,
                title: "Webhooks & APIs",
                description: "Trigger workflows from Stripe, GitHub, or any webhook. Push results to Slack, email, or your database.",
                color: "emerald",
              },
              {
                icon: GitBranch,
                title: "Conditional Logic",
                description: "If-then branching that actually makes sense. Route data based on any condition you define.",
                color: "sky",
              },
              {
                icon: Clock,
                title: "Scheduled Runs",
                description: "Set it and forget it. Daily reports at 9am, hourly syncs, or monthly cleanups—your schedule.",
                color: "amber",
              },
              {
                icon: Shield,
                title: "Secure by Default",
                description: "Your credentials stay encrypted. Scoped API keys, webhook signatures, and audit logs included.",
                color: "rose",
              },
              {
                icon: Users,
                title: "Built for Teams",
                description: "Share workflows across your team. Version history keeps everyone on the same page.",
                color: "indigo",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
                      : feature.color === "emerald"
                      ? "bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800"
                      : feature.color === "sky"
                      ? "bg-sky-100 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-800"
                      : feature.color === "amber"
                      ? "bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800"
                      : feature.color === "rose"
                      ? "bg-rose-100 dark:bg-rose-900/50 border border-rose-200 dark:border-rose-800"
                      : "bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800"
                  }`}
                >
                  <feature.icon
                    className={`w-6 h-6 ${
                      feature.color === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : feature.color === "emerald"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : feature.color === "sky"
                        ? "text-sky-600 dark:text-sky-400"
                        : feature.color === "amber"
                        ? "text-amber-600 dark:text-amber-400"
                        : feature.color === "rose"
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-indigo-600 dark:text-indigo-400"
                    }`}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-muted/50 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Build once. Run forever.
            </h2>
            <p className="text-xl text-muted-foreground">
              Go from idea to production-ready automation in under 5 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="pt-8 pl-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">Pick a trigger</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Webhook hits your endpoint? New Stripe payment? Scheduled time? Choose what starts your workflow.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="pt-8 pl-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">Connect your steps</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Drag an AI node. Add a condition. Call an API. Connect them visually—see your logic take shape.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="pt-8 pl-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">Hit run. Walk away.</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your workflow runs automatically. Check the logs anytime, or just trust it's handling business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your competitors are already automating.
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Every hour you spend on repetitive tasks is an hour your competition uses to get ahead. Start building smarter today.
          </p>
          <Link
            href="/workflow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-gray-50 text-blue-700 font-semibold rounded-xl transition-all duration-200 text-lg shadow-lg"
          >
            <Zap className="w-6 h-6" />
            Start Automating Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">Flowys</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Flowys. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
