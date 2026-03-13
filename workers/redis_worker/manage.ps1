param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("build", "up", "down", "restart", "logs", "all", "volumes", "volumes-rm", "volume-rm", "tag", "build-tag")]
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


function GetAppVersion {
    $envPath = Join-Path $PSScriptRoot ".env"
    if (-not (Test-Path $envPath)) {
        throw "Missing .env file at $envPath"
    }

    $line = Get-Content $envPath | Where-Object { $_ -match '^APP_VERSION=' } | Select-Object -First 1
    if (-not $line) {
        throw "APP_VERSION is not defined in $envPath"
    }

    return ($line -split '=', 2)[1].Trim()
}

function GetImageName {
    $composePath = Join-Path $PSScriptRoot "docker-compose.yaml"
    if (-not (Test-Path $composePath)) {
        throw "Missing docker-compose.yaml at $composePath"
    }

    $line = Get-Content $composePath | Where-Object { $_ -match '^\s*image:\s*' } | Select-Object -First 1
    if (-not $line) {
        throw "No 'image:' entry found in $composePath. Add explicit image name before tagging."
    }

    return ($line -replace '^\s*image:\s*', '').Trim()
}

function Tag {
    $image = GetImageName
    $version = GetAppVersion
    $repo = ($image -split ':', 2)[0]
    $taggedImage = "${repo}:$version"

    Write-Host "[*] Tagging image '$image' as '$taggedImage'..." -ForegroundColor Cyan
    docker image inspect $image | Out-Null
    docker tag $image $taggedImage
    Write-Host "[OK] Tagged image as $taggedImage" -ForegroundColor Green
}

function BuildTag {
    Build
    Tag
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
        "tag" { Tag }
        "build-tag" { BuildTag }
    }
}
catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}



