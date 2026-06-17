# setup-claude-local.ps1
# הרץ כ-Administrator ב-PowerShell

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step { param($msg) Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-OK   { param($msg) Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-Fail { param($msg) Write-Host "    [!]  $msg" -ForegroundColor Red }

Write-Host "`nClaude Code - Setup Script" -ForegroundColor Magenta
Write-Host "==========================" -ForegroundColor Magenta

# ── 1. בדוק Node.js ──────────────────────────────────────────────────────────
Write-Step "Checking Node.js..."
try {
    $nodeVer = node --version 2>$null
    $major   = [int]($nodeVer -replace 'v(\d+)\..*','$1')
    if ($major -lt 18) {
        Write-Fail "Node.js $nodeVer is too old (need 18+). Downloading installer..."
        Start-Process "https://nodejs.org/en/download" -Wait
        Write-Host "    Re-run this script after installing Node." -ForegroundColor Yellow
        exit 1
    }
    Write-OK "Node.js $nodeVer"
} catch {
    Write-Fail "Node.js not found. Downloading installer..."
    Start-Process "https://nodejs.org/en/download"
    Write-Host "    Re-run this script after installing Node." -ForegroundColor Yellow
    exit 1
}

# ── 2. התקן Claude Code ───────────────────────────────────────────────────────
Write-Step "Installing Claude Code CLI..."
try {
    npm install -g @anthropic-ai/claude-code | Out-Null
    $ver = claude --version 2>$null
    Write-OK "claude $ver installed"
} catch {
    Write-Fail "npm install failed: $_"
    exit 1
}

# ── 3. בדוק מפתח API ──────────────────────────────────────────────────────────
Write-Step "Checking API key..."
if (-not $env:ANTHROPIC_API_KEY) {
    Write-Host ""
    Write-Host "    You need an Anthropic API key." -ForegroundColor Yellow
    Write-Host "    Get one at: https://console.anthropic.com/settings/keys" -ForegroundColor Yellow
    Write-Host ""
    $key = Read-Host "    Paste your API key (or press Enter to skip)"
    if ($key) {
        # שמור בפרופיל PowerShell לצמיתות
        $profileDir = Split-Path $PROFILE
        if (-not (Test-Path $profileDir)) { New-Item -ItemType Directory -Path $profileDir | Out-Null }
        if (-not (Test-Path $PROFILE))    { New-Item -ItemType File    -Path $PROFILE    | Out-Null }
        $line = "`$env:ANTHROPIC_API_KEY = '$key'"
        if (-not (Select-String -Path $PROFILE -Pattern "ANTHROPIC_API_KEY" -Quiet)) {
            Add-Content -Path $PROFILE -Value $line
        }
        $env:ANTHROPIC_API_KEY = $key
        Write-OK "API key saved to PowerShell profile"
    } else {
        Write-Host "    Skipped — set ANTHROPIC_API_KEY manually before running claude." -ForegroundColor Yellow
    }
} else {
    Write-OK "ANTHROPIC_API_KEY already set"
}

# ── 4. סיכום ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "How to use Claude Code:" -ForegroundColor Cyan
Write-Host "  cd C:\path\to\your\project"
Write-Host "  claude                   # opens interactive session"
Write-Host "  claude 'fix the login bug'"
Write-Host "  claude --help            # all options"
Write-Host ""
Write-Host "Useful flags:" -ForegroundColor Cyan
Write-Host "  --model claude-opus-4-8  # most capable model"
Write-Host "  --print 'question'       # one-shot, no interaction"
Write-Host "  --continue               # resume last session"
Write-Host ""
