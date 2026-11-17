"use client";
import { Check, Gift, Info } from "lucide-react";
import { GlassCard, GlassLink } from "@/components/glass";
import { Container, PageHeader, Pill } from "./ui";
import { freeOffer } from "@/data/site";
import { useStore } from "@/lib/store";

export function Pricing() {
  const { state } = useStore();
  return (
    <Container className="max-w-4xl">
      <PageHeader eyebrow={freeOffer.badge} title={freeOffer.title} hi="सब कुछ मुफ़्त — हर सीखने वाले के लिए">
        {freeOffer.tagline}
      </PageHeader>
      <GlassCard padding="lg" selected>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Pill tone="violet"><Gift className="h-3.5 w-3.5" aria-hidden /> {freeOffer.badge}</Pill>
          <Pill tone="success">No payment needed</Pill>
        </div>
        <p className="mt-4">
          <span className="text-5xl font-extrabold text-ink">{freeOffer.price}</span> <span className="text-ink-mute">{freeOffer.period}</span>
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {freeOffer.features.map((f) => (
            <li key={f.label} className="glass-inset flex gap-2 rounded-2xl p-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
              <span className="text-ink">
                {f.label}
                {f.note && <span className="block text-xs text-ink-mute">{f.note}</span>}
              </span>
            </li>
          ))}
        </ul>
        <GlassLink href={state.profile.onboarded ? "/dashboard" : "/onboarding"} variant="primary" size="lg" className="mt-8 w-full sm:w-auto">
          {freeOffer.cta}
        </GlassLink>
      </GlassCard>
      <p className="mt-6 flex gap-2 text-sm text-ink-soft">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-violet" aria-hidden />
        There are no hidden charges and nothing to buy on this site. If we ever introduce paid features, everything you use today stays free and we’ll say so clearly before anything changes.
      </p>
    </Container>
  );
}
