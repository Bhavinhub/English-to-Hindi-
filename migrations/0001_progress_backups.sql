-- Optional, opt-in cloud backups of guest learning progress.
-- Rows are keyed by a random backup code generated in the learner's browser (no personal data).
CREATE TABLE IF NOT EXISTS progress_backups (
  code_hash   TEXT PRIMARY KEY,          -- SHA-256 of the backup code; the code itself is never stored
  data        TEXT NOT NULL,             -- JSON progress snapshot (same shape as localStorage)
  version     INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_progress_backups_updated ON progress_backups (updated_at);
