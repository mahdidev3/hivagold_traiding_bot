param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("build", "up", "down", "restart", "logs", "all", "volumes", "volumes-rm", "volume-rm")]
    [string]$Action,
    [string]$VolumeName
)

$ErrorActionPreference = "Stop"

function Build {
    Write-Host "[*] Pulling Redis image..." -ForegroundColor Cyan
    docker-compose pull redis
    Write-Host "[OK] Build step complete." -ForegroundColor Green
}

function Up {
    Write-Host "[*] Starting Redis service..." -ForegroundColor Cyan
    docker-compose up -d
    Write-Host "[OK] Redis service started." -ForegroundColor Green
    Write-Host "[i] Redis available at: redis://localhost:6379" -ForegroundColor Yellow
}

function Down {
    Write-Host "[*] Stopping Redis service..." -ForegroundColor Cyan
    docker-compose down
    Write-Host "[OK] Redis service stopped." -ForegroundColor Green
}

function Restart {
    Write-Host "[*] Restarting Redis service..." -ForegroundColor Cyan
    docker-compose restart
    Write-Host "[OK] Redis service restarted." -ForegroundColor Green
}

function Logs {
    Write-Host "[*] Showing Redis logs..." -ForegroundColor Cyan
    docker-compose logs -f redis
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



