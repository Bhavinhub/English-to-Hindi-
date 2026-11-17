"use client";
import { useState } from "react";
import { Trash2, Download, CheckCircle2 } from "lucide-react";
import { GlassButton, GlassCard, GlassModal, GlassTabs } from "@/components/glass";
import { Container, PageHeader } from "./ui";
import { CloudBackupCard } from "./CloudBackupCard";
import { writeBackup } from "@/lib/cloud-backup";
import { useStore } from "@/lib/store";
import type { ExplainLang, ThemePref, UiLang } from "@/lib/types";
import { cn } from "@/lib/cn";

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="glass-inset press flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left">
      <span>
        <span className="block font-semibold text-ink">{label}</span>
        <span className="block text-sm text-ink-soft">{desc}</span>
      </span>
      <span className={cn("relative h-7 w-12 shrink-0 rounded-full transition", checked ? "bg-violet" : "bg-[var(--ink-mute)]/40")} aria-hidden>
        <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-6" : "left-1")} />
      </span>
    </button>
  );
}

export function Settings() {
  const { state, actions } = useStore();
  const [confirm, setConfirm] = useState<null | "progress" | "all">(null);
  const [cleared, setCleared] = useState("");
  const p = state.prefs;

  return (
    <Container className="max-w-3xl">
      <PageHeader eyebrow="Settings" title="Settings" hi="सेटिंग्स" />
      <div className="space-y-5">
        <GlassCard as="section" aria-labelledby="s-lang">
          <h2 id="s-lang" className="mb-4 font-bold text-ink">Language</h2>
          <p className="mb-2 text-sm font-semibold text-ink-soft">Interface language</p>
          <GlassTabs<UiLang> semantics="radio" label="Interface language" idPrefix="ui" value={p.uiLang} onChange={(v) => actions.updatePrefs({ uiLang: v })} tabs={[{ id: "en", label: "English" }, { id: "hi", label: <span lang="hi" className="hi">हिंदी</span> }]} />
          <p className="mb-2 mt-5 text-sm font-semibold text-ink-soft">Lesson explanations</p>
          <GlassTabs<ExplainLang> semantics="radio" label="Lesson explanations" idPrefix="ex" value={state.profile.explain} onChange={(v) => actions.updateProfile({ explain: v })} tabs={[{ id: "both", label: "Both" }, { id: "hi", label: "Hindi" }, { id: "en", label: "English" }]} />
        </GlassCard>

        <GlassCard as="section" aria-labelledby="s-app">
          <h2 id="s-app" className="mb-4 font-bold text-ink">Appearance & accessibility</h2>
          <p className="mb-2 text-sm font-semibold text-ink-soft">Theme</p>
          <GlassTabs<ThemePref> semantics="radio" label="Theme" idPrefix="th" value={p.theme} onChange={(v) => actions.updatePrefs({ theme: v })} tabs={[{ id: "system", label: "System" }, { id: "light", label: "Light" }, { id: "dark", label: "Dark" }]} />
          <div className="mt-5 space-y-3">
            <Toggle label="Reduce motion" desc="Turns off hover lifts, flips and animations." checked={p.reducedMotion} onChange={(v) => actions.updatePrefs({ reducedMotion: v })} />
            <Toggle label="Reduce transparency" desc="Uses solid surfaces instead of glass for maximum readability." checked={p.reducedTransparency} onChange={(v) => actions.updatePrefs({ reducedTransparency: v })} />
          </div>
          <label htmlFor="rate-s" className="mt-5 flex justify-between text-sm font-semibold text-ink-soft">
            <span>Speech playback speed</span>
            <span>{p.speechRate.toFixed(2)}×</span>
          </label>
          <input id="rate-s" type="range" min={0.6} max={1.2} step={0.05} value={p.speechRate} onChange={(e) => actions.updatePrefs({ speechRate: Number(e.target.value) })} className="mt-1 h-11 w-full accent-[var(--violet)]" />
        </GlassCard>

        <GlassCard as="section" aria-labelledby="s-goal">
          <h2 id="s-goal" className="mb-4 font-bold text-ink">Daily goal</h2>
          <GlassTabs<"5" | "10" | "20"> semantics="radio"
            label="Daily goal in minutes"
            idPrefix="goal"
            value={String(state.profile.dailyMinutes) as "5" | "10" | "20"}
            onChange={(v) => actions.updateProfile({ dailyMinutes: Number(v) as 5 | 10 | 20 })}
            tabs={[{ id: "5", label: "5 min" }, { id: "10", label: "10 min" }, { id: "20", label: "20 min" }]}
          />
        </GlassCard>

        <CloudBackupCard />

        <GlassCard as="section" aria-labelledby="s-data">
          <h2 id="s-data" className="mb-1 font-bold text-ink">Your data</h2>
          <p className="mb-4 text-sm text-ink-soft">Progress is stored in this browser (localStorage). It is sent to the cloud only if you turn on cloud backup above.</p>
          <div className="flex flex-wrap gap-3">
            <GlassButton
              icon={<Download className="h-4 w-4" aria-hidden />}
              onClick={() => {
                const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "bolo-english-progress.json";
                a.click();
                setTimeout(() => URL.revokeObjectURL(a.href), 1000);
              }}
            >
              Export my data
            </GlassButton>
            <GlassButton variant="danger" icon={<Trash2 className="h-4 w-4" aria-hidden />} onClick={() => setConfirm("progress")}>Clear learning progress</GlassButton>
            <GlassButton variant="danger" icon={<Trash2 className="h-4 w-4" aria-hidden />} onClick={() => setConfirm("all")}>Reset everything</GlassButton>
          </div>
          {cleared && <p role="status" className="mt-3 flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-4 w-4" aria-hidden />{cleared}</p>}
        </GlassCard>
      </div>

      <GlassModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        size="sm"
        title={confirm === "all" ? "Reset everything?" : "Clear learning progress?"}
        description="This can’t be undone."
        footer={
          <>
            <GlassButton onClick={() => setConfirm(null)}>Cancel</GlassButton>
            <GlassButton
              variant="danger"
              onClick={() => {
                if (confirm === "all") {
                  actions.resetEverything();
                  writeBackup(null); // stop backing up from this device (the cloud copy can be deleted first via “Turn off”)
                }
                else actions.resetProgress();
                setCleared(confirm === "all" ? "Everything was reset." : "Learning progress cleared. Your appearance settings were kept.");
                setConfirm(null);
              }}
            >
              Yes, clear it
            </GlassButton>
          </>
        }
      >
        {confirm === "all"
          ? "This deletes completed lessons, practice history, saved words and phrases, reviews, your learning profile and appearance settings from this browser."
          : "This deletes completed lessons, practice history, saved words and phrases, reviews and your learning profile from this browser. Appearance settings are kept."}
      </GlassModal>
    </Container>
  );
}
