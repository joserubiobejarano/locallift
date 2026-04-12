import { type LucideIcon, Check } from "lucide-react";

type FeatureCardProps = {
  label: string;
  title: string;
  points: string[];
  accent: string;
  icon: LucideIcon;
};

export function FeatureCard({ label, title, points, accent, icon: Icon }: FeatureCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition-colors duration-300 hover:border-slate-600">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-3xl bg-gradient-to-br ${accent} opacity-40 blur-2xl`}
      />
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-50">{title}</h3>
      <ul className="mt-4 space-y-2 text-xs text-slate-300/85 sm:text-sm">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
