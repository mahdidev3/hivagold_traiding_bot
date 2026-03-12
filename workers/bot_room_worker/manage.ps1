param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("build", "up", "down", "restart", "logs", "all", "volumes", "volumes-rm", "volume-rm")]
    [string]$Action,
    [string]$VolumeName
)

$ErrorActionPreference = "Stop"

function Build {
    Write-Host "[*] Building Docker image..." -ForegroundColor Cyan
    docker-compose build
    Write-Host "[OK] Build complete." -ForegroundColor Green
}

function Up {
    Write-Host "[*] Starting service..." -ForegroundColor Cyan
    docker-compose up -d
    Write-Host "[OK] Service started." -ForegroundColor Green
    Write-Host "[i] Service available at: http://localhost:8005" -ForegroundColor Yellow
}

function Down {
    Write-Host "[*] Stopping service..." -ForegroundColor Cyan
    docker-compose down
    Write-Host "[OK] Service stopped." -ForegroundColor Green
}

function Restart {
    Write-Host "[*] Restarting service..." -ForegroundColor Cyan
    docker-compose restart
    Write-Host "[OK] Service restarted." -ForegroundColor Green
}

function Logs {
    Write-Host "[*] Showing logs..." -ForegroundColor Cyan
    docker-compose logs -f room-worker
}

function All {
    Build
    Up
    Clear-Host
    Logs
}

function ShowVolumes {
    Write-Host "[*] Docker volumes (with size):" -ForegroundColor Cyan
    docker system df -v
}

function RemoveComposeVolumes {
    Write-Host "[*] Removing service and associated compose volumes..." -ForegroundColor Cyan
    docker-compose down -v
    Write-Host "[OK] Compose volumes removed." -ForegroundColor Green
}

function RemoveSingleVolume {
    if ([string]::IsNullOrWhiteSpace($VolumeName)) {
        throw "For action 'volume-rm', provide -VolumeName <name>."
    }

    Write-Host "[*] Removing volume '$VolumeName'..." -ForegroundColor Cyan
    docker volume rm $VolumeName
    Write-Host "[OK] Volume '$VolumeName' removed." -ForegroundColor Green
}

try {
    switch ($Action) {
        "build" { Build }
        "up" { Up }
        "down" { Down }
        "restart" { Restart }
        "logs" { Logs }
        "all" { All }
        "volumes" { ShowVolumes }
        "volumes-rm" { RemoveComposeVolumes }
        "volume-rm" { RemoveSingleVolume }
    }
}
catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}



