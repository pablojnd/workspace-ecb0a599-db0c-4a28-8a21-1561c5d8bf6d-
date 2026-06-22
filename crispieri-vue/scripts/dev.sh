#!/bin/bash
# Dev script for Crispieri Vue + InsForge
# Run from repo root: ./scripts/dev.sh

set -e

echo "=== Crispieri Dev Server ==="

# Start frontend in background
echo "Starting frontend (Vite)..."
(cd crispieri-vue/frontend && bun run dev) &
FRONTEND_PID=$!

# Start InsForge functions in background if supabase CLI available
if command -v supabase &> /dev/null; then
  echo "Starting InsForge functions..."
  (cd crispieri-vue && supabase functions serve) &
  FUNCTIONS_PID=$!
else
  echo "Supabase CLI not found. Start InsForge functions manually."
  FUNCTIONS_PID=""
fi

echo ""
echo "Frontend: http://localhost:5173"
echo "Functions: http://localhost:54321/functions/v1/"
echo "Press Ctrl+C to stop all servers"
echo ""

cleanup() {
  echo "Stopping servers..."
  kill $FRONTEND_PID 2>/dev/null || true
  [ -n "$FUNCTIONS_PID" ] && kill $FUNCTIONS_PID 2>/dev/null || true
  exit 0
}

trap cleanup INT TERM
wait
