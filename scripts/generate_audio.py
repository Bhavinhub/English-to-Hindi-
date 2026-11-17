"""
Generate natural-voice MP3 clips with the free `edge-tts` tool (no API key).
Voices: en-IN-NeerjaNeural (female, Mira) and en-IN-PrabhatNeural (male).

  python3 -m pip install edge-tts
  npm run audio:collect
  python3 scripts/generate_audio.py          # writes public/audio/<key>.mp3, skips existing

Clips are generated once and committed; the website itself needs no TTS service.
"""
import asyncio, json, pathlib, sys
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"
LINES = json.loads((ROOT / "scripts" / "audio-lines.json").read_text())
RATE = "-6%"  # a touch slower than default, easier for learners
CONCURRENCY = 6


async def make(line, sem, stats):
    target = OUT / f"{line['key']}.mp3"
    if target.exists() and target.stat().st_size > 1000:
        stats["skipped"] += 1
        return
    async with sem:
        for attempt in range(4):
            try:
                await edge_tts.Communicate(line["text"], line["voice"], rate=RATE).save(str(target))
                if target.stat().st_size > 1000:
                    stats["made"] += 1
                    return
            except Exception as e:  # network hiccup: retry
                err = e
            await asyncio.sleep(1.5 * (attempt + 1))
        stats["failed"].append(line["text"])
        print("FAILED:", line["text"], file=sys.stderr)


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(CONCURRENCY)
    stats = {"made": 0, "skipped": 0, "failed": []}
    await asyncio.gather(*(make(l, sem, stats) for l in LINES))
    # remove clips no longer referenced
    keep = {f"{l['key']}.mp3" for l in LINES}
    removed = 0
    for f in OUT.glob("*.mp3"):
        if f.name not in keep:
            f.unlink(); removed += 1
    print(f"made {stats['made']}, skipped {stats['skipped']}, removed {removed}, failed {len(stats['failed'])}")
    if stats["failed"]:
        sys.exit(1)


asyncio.run(main())
