param(
    [Parameter(Position = 0)]
    [ValidateSet("doctor", "update", "build", "start", "stop", "restart", "status", "logs", "help")]
    [string]$Action = "help",

    [Parameter(Position = 1)]
    [string]$Target = "all"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RemoteUrl = if ($env:DOCTOR_REMOTE_URL) { $env:DOCTOR_REMOTE_URL } else { "https://github.com/mahdidev3/hivagold_traiding_bot.git" }

$Workers = @{
    "api_server" = 8000
    "bot_captcha_worker" = 8001
    "bot_auth_worker" = 8002
    "bot_room_worker" = 8005
    "bot_trading_worker" = 8006
    "bot_simulator_worker" = 8007
}

function Resolve-Workers {
    if ($Target -eq "all") { return $Workers.Keys }
    if (-not $Workers.ContainsKey($Target)) { throw "Unknown target '$Target'." }
    return @($Target)
}

function Invoke-Manage([string]$Worker, [string]$ManageAction) {
    $script = Join-Path $RepoRoot "workers/$Worker/management/manage.ps1"
    Write-Host "[*] $Worker -> $ManageAction" -ForegroundColor Cyan
    & $script -Action $ManageAction
}

function Invoke-Doctor {
    Write-Host "[*] Running doctor checks..." -ForegroundColor Cyan
    foreach ($cmd in @("git", "python", "docker", "curl")) {
        if (Get-Command $cmd -ErrorAction SilentlyContinue) {
            Write-Host "[OK] command '$cmd' found" -ForegroundColor Green
        }
        else {
            Write-Host "[WARN] command '$cmd' not found" -ForegroundColor Yellow
        }
    }

    $branch = git -C $RepoRoot rev-parse --abbrev-ref HEAD
    Write-Host "[i] current branch: $branch" -ForegroundColor Yellow

    foreach ($worker in Resolve-Workers) {
        $port = $Workers[$worker]
        $manageScript = Join-Path $RepoRoot "workers/$worker/management/manage.ps1"
        if (Test-Path $manageScript) {
            Write-Host "[OK] manage script exists: workers/$worker/management/manage.ps1" -ForegroundColor Green
        } else {
            Write-Host "[WARN] missing manage script for $worker" -ForegroundColor Yellow
        }

        try {
            $null = Invoke-RestMethod -Uri "http://localhost:$port/health" -Method Get -TimeoutSec 5
            Write-Host "[OK] $worker health endpoint is reachable on :$port" -ForegroundColor Green
        } catch {
            Write-Host "[WARN] $worker health endpoint is not reachable on :$port" -ForegroundColor Yellow
        }
    }
}

function Invoke-Update {
    if ((git -C $RepoRoot status --porcelain).Trim()) {
        throw "Working tree has local changes. Commit or stash them before update."
    }
    $branch = git -C $RepoRoot rev-parse --abbrev-ref HEAD
    git -C $RepoRoot fetch $RemoteUrl $branch
    git -C $RepoRoot pull --ff-only $RemoteUrl $branch

    $script:Target = "all"
    Invoke-Restart
}

function Invoke-Start { foreach ($w in Resolve-Workers) { Invoke-Manage -Worker $w -ManageAction "up" } }
function Invoke-Stop { foreach ($w in Resolve-Workers) { Invoke-Manage -Worker $w -ManageAction "down" } }
function Invoke-Restart { foreach ($w in Resolve-Workers) { Invoke-Manage -Worker $w -ManageAction "restart" } }
function Invoke-Build { foreach ($w in Resolve-Workers) { Invoke-Manage -Worker $w -ManageAction "build" } }

function Invoke-Status {
    foreach ($w in Resolve-Workers) {
        $port = $Workers[$w]
        try {
            $null = Invoke-RestMethod -Uri "http://localhost:$port/health" -Method Get -TimeoutSec 5
            Write-Host "[OK] $w running on :$port" -ForegroundColor Green
        } catch {
            Write-Host "[WARN] $w not reachable on :$port" -ForegroundColor Yellow
        }
    }
}

function Invoke-Logs {
    if ($Target -eq "all") {
        throw "logs action requires a single worker target"
    }
    Invoke-Manage -Worker $Target -ManageAction "logs"
}

function Show-Help {
@"
Usage: ./doctor.ps1 <action> [target]

Actions:
  doctor   Run diagnostics (commands, git, health checks)
  update   Pull latest code from $RemoteUrl and restart all workers
  build    Build docker images for target worker(s)
  start    Start target worker(s)
  stop     Stop target worker(s)
  restart  Restart target worker(s)
  status   Check /health for target worker(s)
  logs     Follow docker logs for one worker target
  help     Show this message

Targets:
  all (default)
  api_server | bot_captcha_worker | bot_auth_worker | bot_room_worker | bot_trading_worker | bot_simulator_worker
"@
}

switch ($Action) {
    "doctor" { Invoke-Doctor }
    "update" { Invoke-Update }
    "build" { Invoke-Build }
    "start" { Invoke-Start }
    "stop" { Invoke-Stop }
    "restart" { Invoke-Restart }
    "status" { Invoke-Status }
    "logs" { Invoke-Logs }
    default { Show-Help }
}
