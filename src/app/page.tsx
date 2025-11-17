"use client";

import { useState } from "react";
import Link from "next/link";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "Do I need a website to use LocalLift?",
    answer:
      "No. LocalLift works even if you only have a Google Business Profile. Connect your profile and we'll start replying to reviews and generating content right away.",
  },
  {
    question: "Can I use LocalLift if I manage multiple locations?",
    answer:
      "Yes. You can connect multiple locations and manage all their reviews, content, and audits from a single dashboard.",
  },
  {
    question: "Will the AI replies sound like my brand?",
    answer:
      "Yes. During onboarding we learn your tone of voice and preferred style. LocalLift uses that to draft replies that sound like you wrote them.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. You get a 14-day free trial with full access. No setup fees and you can cancel anytime.",
  },
  {
    question: "Which profiles do you support?",
    answer:
      "We start with Google Business Profile and are working on Apple Maps and other platforms. You'll be able to manage all key local profiles from one place.",
  },
];

const audience = [
  "Restaurants",
  "Clinics",
  "Salons",
  "Gyms",
  "Local services",
  "Retail stores",
];

export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(faqs[0]?.question ?? null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-48 top-0 h-72 w-72 rounded-full bg-purple-700/30 blur-3xl" />
        <div className="absolute -right-40 top-40 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-orange-400">
            <span className="text-sm font-semibold text-slate-950">LL</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">LocalLift</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-200/80 md:flex">
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#testimonials" className="hover:text-white">
            Customers
          </a>
          <a href="#faq" className="hover:text-white">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-100/80 hover:text-white md:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/login?demo=1"
            className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:bg-white"
          >
            Try the demo
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-4 md:px-6 lg:px-8">
        {/* HERO */}
        <section className="grid gap-10 py-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:py-16">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200/80">
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-orange-400 text-[10px] text-slate-950">
                AI
              </span>
              For local businesses
            </div>
            <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
              Win more local customers,{" "}
              <span className="text-transparent bg-gradient-to-r from-orange-400 via-fuchsia-400 to-purple-400 bg-clip-text">
                without doing more work
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-200/80 sm:text-xl">
              LocalLift manages your Google Business Profile for you. Automatic review
              replies, weekly local content, and profile audits, so you show up higher
              and attract more customers.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/30 hover:brightness-110"
              >
                Start free trial
              </Link>
              <button className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-slate-500">
                Watch demo
              </button>
              <span className="text-xs text-slate-400">
                14-day free trial • No credit card required
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="absolute -right-10 -top-6 h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-sky-400 opacity-60 blur-lg md:h-20 md:w-20" />
            <div className="absolute -left-6 bottom-0 h-20 w-20 rounded-3xl bg-gradient-to-br from-orange-500 to-rose-500 opacity-60 blur-xl" />
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Today&apos;s reviews
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-semibold">23</p>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  100% replied
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {["Great food and friendly staff!", "Parking was tricky but service was great.", "Fast service, will come back!"].map(
                  (text, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-3"
                    >
                      <div className="mr-3">
                        <p className="text-xs font-medium text-slate-300">
                          Google review
                        </p>
                        <p className="mt-1 text-xs text-slate-300/90 line-clamp-2">
                          {text}
                        </p>
                      </div>
                      <button className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-950 hover:bg-white">
                        Approve reply
                      </button>
                    </div>
                  )
                )}
              </div>
              <div className="mt-5 grid gap-3 rounded-2xl bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-orange-500/10 p-4">
                <p className="text-xs font-medium text-slate-300">
                  This week&apos;s impact
                </p>
                <div className="flex flex-wrap items-center gap-5 text-xs text-slate-200/80">
                  <div>
                    <p className="font-semibold text-white">+37%</p>
                    <p className="text-slate-400">More profile views</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">+22%</p>
                    <p className="text-slate-400">Calls from Google</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">0</p>
                    <p className="text-slate-400">Unanswered reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OVERVIEW / FEATURES */}
        <section id="features" className="py-12">
          <div className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Your toolkit
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Everything your local profile needs, handled automatically
            </h2>
            <p className="mt-3 max-w-3xl mx-auto text-base text-slate-300/80 sm:text-lg">
              LocalLift keeps your Google Business Profile active, accurate, and
              customer-ready, without you spending hours inside dashboards.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              label="Review replies"
              title="Reply to every review in seconds"
              points={[
                "Inbox view of all your reviews in one place",
                "On-brand AI drafts you can approve in one click",
                "Send replies directly to Google",
              ]}
              accent="from-purple-500 to-sky-400"
            />

            <FeatureCard
              label="Local content"
              title="Turn searchers into regulars"
              points={[
                "Blog ideas and outlines tailored to your city",
                "Ready-to-post Google updates for promos and events",
                "FAQ ideas based on what people actually search",
              ]}
              accent="from-orange-400 to-pink-500"
            />

            <FeatureCard
              label="Profile audits"
              title="Keep your profile fully optimized"
              points={[
                "Spot missing hours, photos, and descriptions",
                "Fix ranking issues with clear action steps",
                "Get ongoing health checks for your profile",
              ]}
              accent="from-emerald-400 to-teal-400"
            />
          </div>
        </section>

        {/* PAIN / PAYOFF */}
        <section className="mt-10 grid gap-10 rounded-3xl bg-slate-900/60 px-6 py-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:px-10">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Stop losing customers to outdated profiles
            </h2>
            <p className="mt-4 text-base text-slate-300/85 sm:text-lg">
              When people search on Google Maps, they compare you to competitors in
              seconds. If your profile looks empty, slow, or out of date, you lose
              them, often without knowing it.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200/80">
              <li>• People trust businesses that answer reviews quickly.</li>
              <li>• Incomplete profiles get pushed down in search results.</li>
              <li>• Most owners don't have time to keep everything updated.</li>
              <li>• LocalLift does the boring work for you, automatically.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-4">
              <p className="text-xs font-semibold text-red-300">Without LocalLift</p>
              <ul className="mt-3 space-y-2 text-xs text-red-100/90">
                <li>• Unanswered reviews sitting for days or weeks</li>
                <li>• Outdated opening hours and old photos</li>
                <li>• Competitors with fresher profiles winning the click</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold text-emerald-300">
                With LocalLift
              </p>
              <ul className="mt-3 space-y-2 text-xs text-emerald-100/90">
                <li>• Every review receives a warm, professional reply</li>
                <li>• Weekly content and updates keep you visible</li>
                <li>• Ongoing audits catch issues before customers do</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FEATURE DEEP DIVES */}
        <section className="space-y-14 py-16">
          {/* Review replies */}
          <FeatureSplit
            label="Review replies"
            title="Reply to every review in seconds"
            description="LocalLift turns your Google reviews into a simple inbox. We draft on-brand replies instantly, so you can approve and send in one click."
            bullets={[
              "One clean inbox view for all your reviews",
              "Suggested replies based on your tone of voice",
              "Send directly to Google, no copy/paste needed",
            ]}
            variant="left"
          />

          {/* Local content */}
          <FeatureSplit
            label="Local SEO content"
            title="Turn searchers into regulars with local content"
            description="Stop guessing what to post. LocalLift writes content ideas and drafts tailored to your city, niche, and customers."
            bullets={[
              "Blog outlines and drafts based on your services and area",
              "Google posts for promos, events, and seasonal offers",
              "FAQ content that answers what people actually search",
            ]}
            variant="right"
          />

          {/* Audits */}
          <FeatureSplit
            label="Profile audits"
            title="Keep your profile fully optimized"
            description="LocalLift audits your profile on autopilot, so you never get caught with missing info or poor local visibility."
            bullets={[
              "Automatic checks for hours, photos, descriptions, and links",
              "Suggestions to improve rankings and conversion",
              "Alerts when something important needs your attention",
            ]}
            variant="left"
          />
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-12">
          <div className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Testimonials
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Trusted by local businesses that rely on Google
            </h2>
            <p className="mt-3 max-w-3xl mx-auto text-base text-slate-300/80 sm:text-lg">
              From busy restaurants to clinics and gyms, LocalLift helps owners keep
              their profiles sharp without staying up late replying to reviews.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <TestimonialCard
              business="BurgerMat"
              role="Owner"
              location="Madrid"
              name="Marta Ruiz"
              text="Before LocalLift, I replied to reviews from my phone between orders. Now every review gets a thoughtful answer without me staying up late."
              color="bg-gradient-to-br from-orange-500/30 to-pink-500/20"
            />

            <TestimonialCard
              business="Smiles & Co Dental"
              role="Clinic manager"
              location="London"
              name="Dr. Alex Carter"
              text="We get a lot of anxious patients reading our reviews first. LocalLift helps us answer fast and keep the tone warm and professional."
              color="bg-gradient-to-br from-purple-500/30 to-indigo-500/20"
            />

            <TestimonialCard
              business="UrbanFit Gym"
              role="Marketing lead"
              location="Barcelona"
              name="Nina López"
              text="Our team was too busy to keep the Google profile updated. Now we have fresh posts each week and reviews are always replied to."
              color="bg-gradient-to-br from-sky-500/30 to-blue-500/20"
            />
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="mt-10 rounded-3xl bg-slate-900/70 px-6 py-10">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Who it&apos;s for
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              If customers find you on Google Maps, LocalLift can help
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 md:grid-cols-6">
            {audience.map((item, idx) => {
              const colors = [
                "from-orange-500/20 to-pink-500/20 border-orange-500/40 hover:from-orange-500/30 hover:to-pink-500/30",
                "from-purple-500/20 to-sky-500/20 border-purple-500/40 hover:from-purple-500/30 hover:to-sky-500/30",
                "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 hover:from-emerald-500/30 hover:to-teal-500/30",
                "from-orange-500/20 to-rose-500/20 border-orange-500/40 hover:from-orange-500/30 hover:to-rose-500/30",
                "from-indigo-500/20 to-purple-500/20 border-indigo-500/40 hover:from-indigo-500/30 hover:to-purple-500/30",
                "from-sky-500/20 to-blue-500/20 border-sky-500/40 hover:from-sky-500/30 hover:to-blue-500/30",
              ];
              return (
                <div
                  key={item}
                  className={`flex h-28 flex-col items-center justify-center rounded-2xl border bg-gradient-to-br ${colors[idx % colors.length]} text-center text-sm font-semibold text-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer`}
                >
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              FAQ
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Stuff people ask before they start
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFAQ === faq.question;
              return (
                <button
                  key={faq.question}
                  onClick={() =>
                    setOpenFAQ((prev) =>
                      prev === faq.question ? null : faq.question
                    )
                  }
                  className="flex w-full flex-col rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-left hover:border-slate-600"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${faq.question}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-50">
                      {faq.question}
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 text-xs" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                  {isOpen && (
                    <p id={`faq-${faq.question}`} className="mt-2 text-xs text-slate-300/85 sm:text-sm">
                      {faq.answer}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mt-4 rounded-3xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-orange-400 px-6 py-10 text-center text-slate-950">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Ready to boost your local visibility?
          </h2>
          <p className="mt-3 max-w-3xl mx-auto text-base sm:text-lg">
            Start your free trial today and see how many more customers you can win
            from Google, without adding more to your to-do list.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-50 shadow-lg hover:bg-black"
            >
              Start free trial
            </Link>
            <button className="inline-flex items-center rounded-full border border-slate-950/30 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-white/20">
              Talk to us
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-950/80">
            No setup fees. 14-day free trial. Cancel anytime.
          </p>
        </section>
      </main>

      {/* Simple footer */}
      <footer className="border-t border-slate-900/60 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-xs text-slate-500 md:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} LocalLift. All rights reserved.</span>
          <div className="flex gap-4">
            <button className="hover:text-slate-300">Privacy</button>
            <button className="hover:text-slate-300">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

type FeatureCardProps = {
  label: string;
  title: string;
  points: string[];
  accent: string; // gradient tailwind classes, e.g. "from-purple-500 to-sky-400"
};

function FeatureCard({ label, title, points, accent }: FeatureCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 hover:border-slate-600">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-3xl bg-gradient-to-br ${accent} opacity-40 blur-2xl`}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <h3 className="mt-3 text-lg font-semibold text-slate-50">{title}</h3>
      <ul className="mt-4 space-y-2 text-xs text-slate-300/85 sm:text-sm">
        {points.map((p) => (
          <li key={p}>• {p}</li>
        ))}
      </ul>
    </div>
  );
}

type FeatureSplitProps = {
  label: string;
  title: string;
  description: string;
  bullets: string[];
  variant?: "left" | "right";
};

function FeatureSplit({
  label,
  title,
  description,
  bullets,
  variant = "left",
}: FeatureSplitProps) {
  const isLeft = variant === "left";
  return (
    <div
      className={`grid gap-8 md:grid-cols-2 md:items-center ${
        !isLeft ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className={isLeft ? "" : "md:order-2"}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {label}
        </p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h3>
        <p className="mt-4 text-base text-slate-300/85 sm:text-lg">
          {description}
        </p>
        <ul className="mt-5 space-y-2 text-sm text-slate-200/85 sm:text-base">
          {bullets.map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>
      </div>
      <div className={isLeft ? "" : "md:order-1"}>
        <div className="relative h-full min-h-[300px] rounded-3xl border border-slate-800 bg-slate-900/70 p-6 overflow-hidden">
          {/* Window header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-slate-700/80" />
              <div className="h-3 w-3 rounded-full bg-slate-700/80" />
              <div className="h-3 w-3 rounded-full bg-slate-700/80" />
            </div>
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-purple-500/30 via-sky-500/30 to-orange-400/30" />
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-rose-400" />
            </div>
          </div>
          
          {/* Content area with icons/graphics */}
          <div className="space-y-4">
            {/* Feature-specific graphics */}
            {label.toLowerCase().includes("review") && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-sky-500/20 p-3 border border-purple-500/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-sky-400 text-white text-xs font-bold">5★</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-purple-500/40 mb-2" />
                    <div className="h-2 w-3/4 rounded-full bg-purple-400/30" />
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-pink-500/20 p-3 border border-orange-500/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-400 text-white text-xs font-bold">4★</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-orange-500/40 mb-2" />
                    <div className="h-2 w-2/3 rounded-full bg-orange-400/30" />
                  </div>
                </div>
              </div>
            )}
            
            {label.toLowerCase().includes("content") && (
              <div className="space-y-3">
                <div className="rounded-xl bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-500/20 p-4 border border-orange-500/30">
                  <div className="h-3 w-3/4 rounded-full bg-orange-400/50 mb-2" />
                  <div className="h-3 w-full rounded-full bg-pink-400/40 mb-2" />
                  <div className="h-3 w-2/3 rounded-full bg-purple-400/30" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-orange-500/15 to-pink-500/15 p-3 border border-orange-500/20">
                    <div className="h-2 w-full rounded-full bg-orange-400/40 mb-1" />
                    <div className="h-2 w-2/3 rounded-full bg-pink-400/30" />
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-purple-500/15 to-sky-500/15 p-3 border border-purple-500/20">
                    <div className="h-2 w-full rounded-full bg-purple-400/40 mb-1" />
                    <div className="h-2 w-3/4 rounded-full bg-sky-400/30" />
                  </div>
                </div>
              </div>
            )}
            
            {label.toLowerCase().includes("audit") && (
              <div className="space-y-3">
                <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-sky-500/20 p-4 border border-emerald-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/40 flex items-center justify-center">
                      <div className="h-4 w-4 rounded border-2 border-emerald-400 border-t-transparent" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-emerald-400/50 mb-1" />
                      <div className="h-2 w-2/3 rounded-full bg-teal-400/40" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-8 rounded bg-emerald-500/30" />
                    <div className="h-8 rounded bg-teal-500/30" />
                    <div className="h-8 rounded bg-sky-500/30" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <div className="h-2 flex-1 rounded-full bg-emerald-500/30" />
                </div>
              </div>
            )}
          </div>
          
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-orange-500/5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

type TestimonialCardProps = {
  business: string;
  role: string;
  location: string;
  name: string;
  text: string;
  color: string; // e.g. "bg-orange-500/10"
};

function TestimonialCard({
  business,
  role,
  location,
  name,
  text,
  color,
}: TestimonialCardProps) {
  return (
    <div
      className={`flex flex-col justify-between rounded-3xl border border-slate-800 ${color} p-6 text-slate-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 hover:border-slate-700 cursor-pointer`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/90">
          {business}
        </p>
        <p className="mt-3 text-sm text-slate-100 leading-relaxed sm:text-base">{text}</p>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50/20 text-xs font-semibold text-slate-50 backdrop-blur-sm">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="text-xs text-slate-200/90 sm:text-sm">
          <p className="font-semibold text-slate-50">{name}</p>
          <p>
            {role} · {location}
          </p>
        </div>
      </div>
    </div>
  );
}
