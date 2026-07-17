#!/usr/bin/env bash
cd /home/z/my-project
while true; do
  echo "[$(date -Iseconds)] starting dev server" >> /home/z/my-project/.zscripts/watchdog.log
  bun run dev >> /home/z/my-project/dev.log 2>&1
  echo "[$(date -Iseconds)] dev server exited (code $?) — restarting in 2s" >> /home/z/my-project/.zscripts/watchdog.log
  sleep 2
done
