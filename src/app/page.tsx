"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  CheckCircle,
  UtensilsCrossed,
  Stethoscope,
  Scissors,
  Dumbbell,
  Wrench,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/marketing/Header";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { FeatureSplit } from "@/components/marketing/FeatureSplit";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";

const howItWorks = [
  {
    number: 1,
    title: "Connect your Google Business Profile",
    description:
      "Link your GBP in a few clicks so LocalLift can pull in your reviews and business details.",
    accent: "from-purple-500 to-sky-400",
  },
  {
    number: 2,
    title: "We learn your tone and sync your reviews",
    description:
      "Your reviews, business info, and insights update automatically — no manual input needed.",
    accent: "from-orange-400 to-pink-500",
  },
  {
    number: 3,
    title: "Replies, content, and audits — all handled",
    description:
      "AI-powered review replies, blog ideas, and Google posts from a single clean dashboard.",
    accent: "from-emerald-400 to-teal-400",
  },
];

const featureCards = [
  {
    label: "Review replies",
    title: "Reply to every review in seconds",
    points: [
      "Inbox view of all your reviews in one place",
      "On-brand AI drafts you can approve in one click",
      "Send replies directly to Google",
    ],
    accent: "from-purple-500 to-sky-400",
    icon: MessageSquare,
  },
  {
    label: "Local content",
    title: "Turn searchers into regulars",
    points: [
      "Blog ideas and outlines tailored to your city",
      "Ready-to-post Google updates for promos and events",
      "FAQ ideas based on what people actually search",
    ],
    accent: "from-orange-400 to-pink-500",
    icon: FileText,
  },
  {
    label: "Profile audits",
    title: "Keep your profile fully optimized",
    points: [
      "Spot missing hours, photos, and descriptions",
      "Fix ranking issues with clear action steps",
      "Get ongoing health checks for your profile",
    ],
    accent: "from-emerald-400 to-teal-400",
    icon: CheckCircle,
  },
];

const testimonials = [
  {
    business: "BurgerMat",
    role: "Owner",
    location: "Madrid",
    name: "Marta Ruiz",
    text: "Before LocalLift, I replied to reviews from my phone between orders. Now every review gets a thoughtful answer without me staying up late.",
    color: "bg-gradient-to-br from-orange-500/30 to-pink-500/20",
  },
  {
    business: "Smiles & Co Dental",
    role: "Clinic manager",
    location: "London",
    name: "Dr. Alex Carter",
    text: "We get a lot of anxious patients reading our reviews first. LocalLift helps us answer fast and keep the tone warm and professional.",
    color: "bg-gradient-to-br from-purple-500/30 to-indigo-500/20",
  },
  {
    business: "UrbanFit Gym",
    role: "Marketing lead",
    location: "Barcelona",
    name: "Nina López",
    text: "Our team was too busy to keep the Google profile updated. Now we have fresh posts each week and reviews are always replied to.",
    color: "bg-gradient-to-br from-sky-500/30 to-blue-500/20",
  },
];

const audience = [
  {
    label: "Restaurants",
    icon: UtensilsCrossed,
    colors:
      "from-orange-500/20 to-pink-500/20 border-orange-500/40 hover:from-orange-500/30 hover:to-pink-500/30",
  },
  {
    label: "Clinics",
    icon: Stethoscope,
    colors:
      "from-purple-500/20 to-sky-500/20 border-purple-500/40 hover:from-purple-500/30 hover:to-sky-500/30",
  },
  {
    label: "Salons",
    icon: Scissors,
    colors:
      "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 hover:from-emerald-500/30 hover:to-teal-500/30",
  },
  {
    label: "Gyms",
    icon: Dumbbell,
    colors:
      "from-orange-500/20 to-rose-500/20 border-orange-500/40 hover:from-orange-500/30 hover:to-rose-500/30",
  },
  {
    label: "Local services",
    icon: Wrench,
    colors:
      "from-indigo-500/20 to-purple-500/20 border-indigo-500/40 hover:from-indigo-500/30 hover:to-purple-500/30",
  },
  {
    label: "Retail stores",
    icon: ShoppingBag,
    colors:
      "from-sky-500/20 to-blue-500/20 border-sky-500/40 hover:from-sky-500/30 hover:to-blue-500/30",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-48 top-0 h-72 w-72 rounded-full bg-purple-700/30 blur-3xl" />
        <div className="absolute -right-40 top-40 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-4 md:px-6 lg:px-8">
        {/* HERO */}
        <section className="grid gap-10 py-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:py-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200/80"
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-orange-400 text-[10px] text-slate-950">
                AI
              </span>
              For local businesses
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
            >
              Win more local customers,{" "}
              <span className="bg-gradient-to-r from-orange-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                without doing more work
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 max-w-2xl text-lg text-slate-200/80 sm:text-xl"
            >
              LocalLift manages your Google Business Profile for you. Automatic review
              replies, weekly local content, and profile audits — so you show up higher
              and attract more customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/30 transition-all hover:brightness-110"
              >
                Start free trial
              </Link>
              <button className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-slate-500">
                Watch demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-400"
            >
              <span>500+ businesses</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>100K+ reviews replied</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>No credit card required</span>
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -right-10 -top-6 h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-sky-400 opacity-60 blur-lg md:h-20 md:w-20" />
            <div className="absolute -left-6 bottom-0 h-20 w-20 rounded-3xl bg-gradient-to-br from-orange-500 to-rose-500 opacity-60 blur-xl" />
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">Today&apos;s reviews</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-2xl font-semibold">23</p>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  100% replied
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  "Great food and friendly staff!",
                  "Parking was tricky but service was great.",
                  "Fast service, will come back!",
                ].map((text, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-3"
                  >
                    <div className="mr-3">
                      <p className="text-xs font-medium text-slate-300">Google review</p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-300/90">{text}</p>
                    </div>
                    <button className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-950 transition-colors hover:bg-white">
                      Approve reply
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 rounded-2xl bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-orange-500/10 p-4">
                <p className="text-xs font-medium text-slate-300">This week&apos;s impact</p>
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
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              How it works
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Get started in 3 simple steps
            </h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6"
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${step.accent} text-sm font-bold text-white`}
                >
                  {step.number}
                </div>
                <h3 className="text-base font-semibold text-slate-50">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300/85">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* OVERVIEW / FEATURES */}
        <section id="features" className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Your toolkit
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Everything your local profile needs, handled automatically
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-base text-slate-300/80 sm:text-lg">
              LocalLift keeps your Google Business Profile active, accurate, and
              customer-ready — without you spending hours inside dashboards.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard
                  label={card.label}
                  title={card.title}
                  points={card.points}
                  accent={card.accent}
                  icon={card.icon}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* PAIN / PAYOFF */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 grid gap-10 rounded-3xl bg-slate-900/60 px-6 py-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:px-10"
        >
          <div>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Stop losing customers to outdated profiles
            </h2>
            <p className="mt-4 text-base text-slate-300/85 sm:text-lg">
              When people search on Google Maps, they compare you to competitors in
              seconds. If your profile looks empty, slow, or out of date, you lose
              them — often without knowing it.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200/80">
              <li>• People trust businesses that answer reviews quickly.</li>
              <li>• Incomplete profiles get pushed down in search results.</li>
              <li>• Most owners don&apos;t have time to keep everything updated.</li>
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
              <p className="text-xs font-semibold text-emerald-300">With LocalLift</p>
              <ul className="mt-3 space-y-2 text-xs text-emerald-100/90">
                <li>• Every review receives a warm, professional reply</li>
                <li>• Weekly content and updates keep you visible</li>
                <li>• Ongoing audits catch issues before customers do</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* FEATURE DEEP DIVES */}
        <section className="space-y-14 py-16">
          {[
            {
              label: "Review replies",
              title: "Reply to every review in seconds",
              description:
                "LocalLift turns your Google reviews into a simple inbox. We draft on-brand replies instantly, so you can approve and send in one click.",
              bullets: [
                "One clean inbox view for all your reviews",
                "Suggested replies based on your tone of voice",
                "Send directly to Google, no copy/paste needed",
              ],
              variant: "left" as const,
            },
            {
              label: "Local SEO content",
              title: "Turn searchers into regulars with local content",
              description:
                "Stop guessing what to post. LocalLift writes content ideas and drafts tailored to your city, niche, and customers.",
              bullets: [
                "Blog outlines and drafts based on your services and area",
                "Google posts for promos, events, and seasonal offers",
                "FAQ content that answers what people actually search",
              ],
              variant: "right" as const,
            },
            {
              label: "Profile audits",
              title: "Keep your profile fully optimized",
              description:
                "LocalLift audits your profile on autopilot, so you never get caught with missing info or poor local visibility.",
              bullets: [
                "Automatic checks for hours, photos, descriptions, and links",
                "Suggestions to improve rankings and conversion",
                "Alerts when something important needs your attention",
              ],
              variant: "left" as const,
            },
          ].map((split) => (
            <motion.div
              key={split.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FeatureSplit {...split} />
            </motion.div>
          ))}
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Testimonials
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Trusted by local businesses that rely on Google
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-base text-slate-300/80 sm:text-lg">
              From busy restaurants to clinics and gyms, LocalLift helps owners keep
              their profiles sharp without staying up late replying to reviews.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.business}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TestimonialCard {...t} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="mt-10 rounded-3xl bg-slate-900/70 px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Who it&apos;s for
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              If customers find you on Google Maps, LocalLift can help
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3 md:grid-cols-6">
            {audience.map(({ label, icon: Icon, colors }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className={`flex h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border bg-gradient-to-br ${colors} text-center transition-all duration-300 hover:shadow-lg`}
              >
                <Icon className="h-6 w-6 text-slate-200" />
                <span className="text-sm font-semibold text-slate-100">{label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">FAQ</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Stuff people ask before they start
            </h2>
          </motion.div>
          <FAQAccordion />
        </section>

        {/* FINAL CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4 rounded-3xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-orange-400 px-6 py-10 text-center text-slate-950"
        >
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Ready to boost your local visibility?
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base sm:text-lg">
            Start your free trial today and see how many more customers you can win
            from Google — without adding more to your to-do list.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-50 shadow-lg transition-colors hover:bg-black"
            >
              Start free trial
            </Link>
            <button className="inline-flex items-center rounded-full border border-slate-950/30 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-white/20">
              Talk to us
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-950/80">
            No setup fees. 14-day free trial. Cancel anytime.
          </p>
        </motion.section>
      </main>
    </div>
  );
}
