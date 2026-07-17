#!/usr/bin/env bash
# Robust watchdog: keeps the Next.js dev server alive, respawning if it crashes.
# Writes to dev.log. Designed for the 4GB sandbox where Turbopack OOMs occasionally.
cd /home/z/my-project
while true; do
  echo "[watchdog $(date -Iseconds)] starting bun run dev"
  bun run dev
  code=$?
  echo "[watchdog $(date -Iseconds)] exited code=$code — respawning in 2s"
  sleep 2
done
