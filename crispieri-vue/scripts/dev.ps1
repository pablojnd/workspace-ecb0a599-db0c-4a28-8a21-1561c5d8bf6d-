#!/usr/bin/env pwsh
# Dev script for Crispieri Vue + InsForge
# Run from repo root: ./scripts/dev.ps1

$ErrorActionPreference = "Stop"

# Start frontend in background
Write-Host "Starting frontend (Vite)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
  Set-Location "$using:PWD\crispieri-vue\frontend"
  bun run dev
}

# Start InsForge functions in background (if supabase CLI available)
$functionsJob = Start-Job -ScriptBlock {
  Set-Location "$using:PWD\crispieri-vue"
  if (Get-Command "supabase" -ErrorAction SilentlyContinue) {
    supabase functions serve
  } else {
    Write-Host "Supabase CLI not found. Start InsForge functions manually." -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "=== Crispieri Dev Server ===" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
if ((Get-Command "supabase" -ErrorAction SilentlyContinue)) {
  Write-Host "Functions: http://localhost:54321/functions/v1/" -ForegroundColor Green
}
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

try {
  while ($true) {
    Start-Sleep -Seconds 1
    Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Receive-Job -Job $functionsJob -ErrorAction SilentlyContinue
  }
} finally {
  Write-Host "Stopping servers..." -ForegroundColor Yellow
  Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
  Stop-Job -Job $functionsJob -ErrorAction SilentlyContinue
  Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
  Remove-Job -Job $functionsJob -ErrorAction SilentlyContinue
}
