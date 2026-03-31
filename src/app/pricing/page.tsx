import Link from "next/link";
import { Header } from "@/components/marketing/Header";
import { Check, X } from "lucide-react";

export const metadata = {
    title: "Pricing - LocalLift",
    description: "One simple plan for local business growth. Start your 7-day free trial.",
};

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <Header />

            <main className="mx-auto max-w-5xl px-4 pb-20 pt-10 md:px-6 lg:px-8">
                {/* HERO */}
                <section className="text-center">
                    <div className="mb-6 inline-flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-xs font-medium text-slate-300">
                        Pricing
                    </div>
                    <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                        One simple plan for local growth
                    </h1>
                    <p className="mt-4 text-lg text-slate-400">
                        Start your 7-day free trial. Cancel anytime.
                    </p>

                    <div className="mt-8 flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold tracking-tight text-slate-50">$14.99</span>
                        <span className="text-lg text-slate-400">/ month</span>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/settings#billing"
                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all"
                        >
                            Start free trial
                        </Link>
                        <Link
                            href="/demo"
                            className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/50 px-8 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
                        >
                            Try live demo
                        </Link>
                    </div>
                    <p className="mt-4 text-xs text-slate-500">
                        No setup fees. No long-term contracts.
                    </p>
                </section>

                {/* PLAN CARD */}
                <section className="mt-16">
                    <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/10 to-transparent pointer-events-none" />

                        <div className="relative text-center">
                            <h2 className="text-2xl font-semibold text-slate-50">LocalLift Starter</h2>
                            <p className="mt-2 text-sm text-slate-400">
                                Everything you need to manage your Google reviews and local content.
                            </p>
                            <div className="mt-6 flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-bold text-slate-50">$14.99</span>
                                <span className="text-sm text-slate-400">/ month</span>
                            </div>
                        </div>

                        <ul className="mt-8 space-y-4 text-sm text-slate-300">
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                                <span>AI replies for your Google reviews</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                                <span>20 content pieces per month (blogs + Google posts + FAQs)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                                <span>5 profile audits per month</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                                <span>Unlimited manual review replies</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                                <span>Access to the free audit landing page</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                                <span>Google Business Profile connection and review sync</span>
                            </li>
                        </ul>

                        <div className="mt-8">
                            <Link
                                href="/settings#billing"
                                className="block w-full rounded-xl bg-slate-50 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-white transition-colors"
                            >
                                Start free trial
                            </Link>
                            <p className="mt-4 text-center text-xs text-slate-500">
                                Need higher limits or agency features? <a href="mailto:support@locallift.com" className="underline hover:text-slate-400">Contact us</a>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* COMPARISON STRIP */}
                <section className="mt-20">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Without LocalLift */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-6">
                            <h3 className="text-lg font-semibold text-slate-400">Without LocalLift</h3>
                            <ul className="mt-4 space-y-3 text-sm text-slate-400">
                                <li className="flex items-start gap-3">
                                    <X className="h-5 w-5 shrink-0 text-slate-600" />
                                    <span>Manually replying to every review</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <X className="h-5 w-5 shrink-0 text-slate-600" />
                                    <span>No idea what to post on Google</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <X className="h-5 w-5 shrink-0 text-slate-600" />
                                    <span>Inconsistent local SEO</span>
                                </li>
                            </ul>
                        </div>

                        {/* With LocalLift */}
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                            <h3 className="text-lg font-semibold text-emerald-400">With LocalLift</h3>
                            <ul className="mt-4 space-y-3 text-sm text-emerald-100/80">
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                                    <span>AI-generated, on-brand replies in seconds</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                                    <span>Local content ideas tailored to your city</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                                    <span>Clear view of what’s working each month</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="mt-24 max-w-3xl mx-auto">
                    <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                        Frequently asked questions
                    </h2>
                    <div className="mt-10 space-y-6">
                        <FAQItem
                            question="Do I need a website to use LocalLift?"
                            answer="No. You can use LocalLift even if you only have a Google Business Profile. We generate Google posts, review replies, and profile audits without needing a website."
                        />
                        <FAQItem
                            question="Can I try it without connecting my Google account?"
                            answer="Yes. You can use the live demo with sample data, and you can run a free audit just by sharing your business profile link or name."
                        />
                        <FAQItem
                            question="What happens when I hit my monthly limits?"
                            answer="You can still log in and see your data, but new content and audits will pause until your monthly usage resets. You can always upgrade in the future if you need more volume."
                        />
                        <FAQItem
                            question="Will LocalLift post anything without my approval?"
                            answer="No. You stay in control. You decide whether a reply or post is published. In the future, you’ll be able to enable automation rules, but they will always be opt-in."
                        />
                        <FAQItem
                            question="Can I cancel anytime?"
                            answer="Yes. You can manage your subscription from the billing portal and cancel at any time. Your data and history remain accessible."
                        />
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="mt-24 rounded-3xl bg-slate-900/50 border border-slate-800 p-8 text-center md:p-12">
                    <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                        Not ready to commit?
                    </h2>
                    <p className="mt-3 text-slate-400">
                        Start with a free profile audit, then upgrade when LocalLift proves its value.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/free-audit"
                            className="inline-flex items-center justify-center rounded-full bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-white transition-colors"
                        >
                            Run a free audit
                        </Link>
                        <Link
                            href="/settings#billing"
                            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-transparent px-6 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                            Start free trial
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
            <h3 className="font-semibold text-slate-200">{question}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{answer}</p>
        </div>
    );
}
