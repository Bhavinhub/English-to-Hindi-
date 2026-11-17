"use client";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Cloud, CloudOff, CloudUpload, DownloadCloud, KeyRound } from "lucide-react";
import { GlassButton, GlassCard, GlassInput, GlassModal } from "@/components/glass";
import { CopyButton } from "./ui";
import { useStore } from "@/lib/store";
import { useServiceStatus } from "@/lib/services";
import { backupApi, newBackupCode, normaliseCode, readBackup, writeBackup, type BackupInfo } from "@/lib/cloud-backup";

function subscribe(cb: () => void) {
  window.addEventListener("bolo-backup-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("bolo-backup-change", cb);
    window.removeEventListener("storage", cb);
  };
}
let cachedRaw: string | null = null;
let cachedInfo: BackupInfo | null = null;
function snapshot() {
  const raw = (() => {
    try {
      return localStorage.getItem("bolo-english:backup");
    } catch {
      return null;
    }
  })();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedInfo = readBackup();
  }
  return cachedInfo;
}

export function CloudBackupCard() {
  const { state, actions } = useStore();
  const services = useServiceStatus();
  const info = useSyncExternalStore(subscribe, snapshot, () => null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [restoreCode, setRestoreCode] = useState("");
  const [confirm, setConfirm] = useState<null | "off" | { code: string; data: unknown; updatedAt: string }>(null);

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    setMsg(null);
    try {
      await fn();
    } catch (e) {
      setMsg({ tone: "err", text: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setBusy(null);
    }
  };

  const turnOn = () =>
    run("on", async () => {
      const code = newBackupCode();
      const r = await backupApi.save(code, state);
      writeBackup({ code, lastSaved: r.updatedAt });
      setMsg({ tone: "ok", text: "Cloud backup is on. Save your backup code somewhere safe." });
    });

  const saveNow = () =>
    run("save", async () => {
      if (!info) return;
      const r = await backupApi.save(info.code, state);
      writeBackup({ ...info, lastSaved: r.updatedAt });
      setMsg({ tone: "ok", text: "Progress backed up." });
    });

  const turnOff = () =>
    run("off", async () => {
      if (!info) return;
      await backupApi.remove(info.code);
      writeBackup(null);
      setConfirm(null);
      setMsg({ tone: "ok", text: "Cloud backup is off and the cloud copy was deleted. Progress on this device is unchanged." });
    });

  const findBackup = () =>
    run("find", async () => {
      const code = normaliseCode(restoreCode);
      const r = await backupApi.load(code);
      setConfirm({ code, data: r.data, updatedAt: r.updatedAt });
    });

  const restore = (c: { code: string; data: unknown; updatedAt: string }) => {
    if (!actions.importState(c.data)) {
      setMsg({ tone: "err", text: "That backup couldn’t be read." });
      return;
    }
    writeBackup({ code: c.code, lastSaved: c.updatedAt });
    setConfirm(null);
    setRestoreCode("");
    setMsg({ tone: "ok", text: "Progress restored. This device now backs up with the same code." });
  };

  const available = services?.cloudBackup;

  return (
    <GlassCard as="section" aria-labelledby="s-cloud">
      <h2 id="s-cloud" className="mb-1 flex items-center gap-2 font-bold text-ink">
        <Cloud className="h-5 w-5 text-violet" aria-hidden /> Cloud backup <span className="text-sm font-normal text-ink-mute">(optional)</span>
      </h2>
      <p className="mb-4 text-sm text-ink-soft">
        Keep a copy of your progress in our Cloudflare database and restore it on another device with a backup code. No name or email is needed. See the{" "}
        <Link href="/privacy" className="font-semibold text-violet underline underline-offset-4">Privacy policy</Link>.
      </p>

      {services === null ? (
        <p className="text-sm text-ink-mute" role="status">Checking availability…</p>
      ) : !available ? (
        <p className="flex items-center gap-2 rounded-2xl bg-warn-soft p-3 text-sm text-ink-soft" role="status">
          <CloudOff className="h-4 w-4 shrink-0 text-warn" aria-hidden /> Cloud backup isn’t available on this copy of the site (no database connected). Your progress is still saved on this device.
        </p>
      ) : info ? (
        <div className="space-y-3">
          <div className="glass-inset rounded-2xl p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink"><KeyRound className="h-4 w-4 text-violet" aria-hidden /> Your backup code</p>
            <p className="mt-1 break-all font-mono text-lg tracking-wider text-ink">{info.code}</p>
            <p className="mt-1 text-xs text-ink-mute">
              Keep it private — anyone with this code can restore your progress. {info.lastSaved ? `Last saved ${new Date(info.lastSaved).toLocaleString()}.` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton text={info.code} />
              <GlassButton size="sm" variant="ghost" loading={busy === "save"} onClick={saveNow} icon={<CloudUpload className="h-4 w-4" aria-hidden />}>Back up now</GlassButton>
              <GlassButton size="sm" variant="danger" disabled={!!busy} onClick={() => setConfirm("off")}>Turn off</GlassButton>
            </div>
          </div>
          <p className="text-xs text-ink-mute">Changes are backed up automatically a few seconds after you learn something.</p>
        </div>
      ) : (
        <GlassButton variant="primary" loading={busy === "on"} onClick={turnOn} icon={<Cloud className="h-4 w-4" aria-hidden />}>Turn on cloud backup</GlassButton>
      )}

      {available && (
        <form
          className="mt-5 border-t border-[var(--glass-edge)] pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (restoreCode.trim()) void findBackup();
          }}
        >
          <p className="mb-2 text-sm font-semibold text-ink">Restore on this device</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <GlassInput id="restore-code" label="Backup code" hideLabel placeholder="ABCD-EFGH-JKLM-NPQR" value={restoreCode} onChange={(e) => setRestoreCode(e.target.value)} autoComplete="off" spellCheck={false} className="font-mono uppercase" />
            <GlassButton type="submit" loading={busy === "find"} disabled={!restoreCode.trim()} icon={<DownloadCloud className="h-4 w-4" aria-hidden />}>Restore</GlassButton>
          </div>
        </form>
      )}

      {msg && (
        <p role={msg.tone === "err" ? "alert" : "status"} className={`mt-3 rounded-2xl p-3 text-sm ${msg.tone === "err" ? "bg-danger-soft text-danger" : "bg-success-soft text-success"}`}>
          {msg.text}
        </p>
      )}

      <GlassModal
        open={confirm === "off"}
        onClose={() => setConfirm(null)}
        size="sm"
        title="Turn off cloud backup?"
        description="The cloud copy will be deleted."
        footer={
          <>
            <GlassButton onClick={() => setConfirm(null)}>Cancel</GlassButton>
            <GlassButton variant="danger" loading={busy === "off"} onClick={turnOff}>Turn off and delete</GlassButton>
          </>
        }
      >
        Progress on this device stays. Other devices using the same code won’t be able to restore it any more.
      </GlassModal>
      <GlassModal
        open={!!confirm && confirm !== "off"}
        onClose={() => setConfirm(null)}
        size="sm"
        title="Restore this backup?"
        description="Progress on this device will be replaced."
        footer={
          <>
            <GlassButton onClick={() => setConfirm(null)}>Cancel</GlassButton>
            <GlassButton variant="primary" onClick={() => confirm && confirm !== "off" && restore(confirm)}>Restore</GlassButton>
          </>
        }
      >
        {confirm && confirm !== "off" && <>Backup last saved {new Date(confirm.updatedAt).toLocaleString()}. Your appearance settings on this device are kept.</>}
      </GlassModal>
    </GlassCard>
  );
}
