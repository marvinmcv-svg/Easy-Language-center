#!/usr/bin/env bash
cd /home/z/my-project
# Check if dev server responds
if ! curl -s -o /dev/null --max-time 5 http://localhost:3000/ >/dev/null 2>&1; then
  pkill -f "next dev" 2>/dev/null
  sleep 1
  nohup bun run dev > /home/z/my-project/dev.log 2>&1 &
  disown
  echo "[$(date -Iseconds)] restarted dev server" >> /home/z/my-project/.zscripts/keepalive.log
fi
