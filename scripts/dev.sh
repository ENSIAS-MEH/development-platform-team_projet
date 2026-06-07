#!/usr/bin/env bash
# Run backend + frontend together (requires pnpm and mvn)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cleanup() {
  trap - EXIT INT TERM
  [[ -n "${BACKEND_PID:-}" ]] && kill "$BACKEND_PID" 2>/dev/null || true
  [[ -n "${FRONTEND_PID:-}" ]] && kill "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Starting backend on :8082..."
(cd "$ROOT/backend" && mvn -q spring-boot:run -Dspring-boot.run.profiles=dev) &
BACKEND_PID=$!

echo "Waiting for API..."
for i in $(seq 1 60); do
  if curl -sf http://localhost:8082/api/projects/open >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo "Starting frontend on :3000..."
(cd "$ROOT/frontend" && pnpm dev) &
FRONTEND_PID=$!

echo ""
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8082"
echo "  Press Ctrl+C to stop both."
wait
