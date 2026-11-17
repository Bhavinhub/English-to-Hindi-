// Lets `node` run the app's TypeScript data files directly: resolves extensionless and "@/…" imports to .ts files.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");

registerHooks({
  resolve(specifier, context, next) {
    let spec = specifier;
    if (spec.startsWith("@/")) spec = pathToFileURL(path.join(SRC, spec.slice(2))).href;
    if ((spec.startsWith(".") || spec.startsWith("file:")) && !/\.[cm]?[jt]sx?$|\.json$/.test(spec)) {
      const base = spec.startsWith("file:") ? fileURLToPath(spec) : path.resolve(path.dirname(fileURLToPath(context.parentURL)), spec);
      for (const ext of [".ts", ".tsx", "/index.ts"]) {
        if (existsSync(base + ext)) return next(pathToFileURL(base + ext).href, context);
      }
    }
    return next(spec, context);
  },
});
