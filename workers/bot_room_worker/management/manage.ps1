param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("build", "up", "down", "restart", "logs", "all", "volumes", "volumes-rm", "volume-rm", "tag", "build-tag")]
    [string]$Action,
    [string]$VolumeName
)

$ErrorActionPreference = "Stop"
$WorkerRoot = (Resolve-Path (Split-Path -Parent $PSScriptRoot)).Path
$ComposeFile = Join-Path $WorkerRoot "docker/docker-compose.yaml"
$EnvFile = Join-Path $WorkerRoot ".env"

function Invoke-Compose {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    docker compose --env-file $EnvFile -f $ComposeFile --project-directory $WorkerRoot @Args
}

function Build { Write-Host "[*] Building Docker image..." -ForegroundColor Cyan; Invoke-Compose build; Write-Host "[OK] Build complete." -ForegroundColor Green }
function Up { Write-Host "[*] Starting service..." -ForegroundColor Cyan; Invoke-Compose up -d; Write-Host "[OK] Service started." -ForegroundColor Green; Write-Host "[i] Service available at: http://localhost:8005" -ForegroundColor Yellow }
function Down { Write-Host "[*] Stopping service..." -ForegroundColor Cyan; Invoke-Compose down; Write-Host "[OK] Service stopped." -ForegroundColor Green }
function Restart { Write-Host "[*] Restarting service..." -ForegroundColor Cyan; Invoke-Compose restart; Write-Host "[OK] Service restarted." -ForegroundColor Green }
function Logs { Write-Host "[*] Showing logs..." -ForegroundColor Cyan; Invoke-Compose logs -f room-worker }
function All { Build; Up; Logs }
function ShowVolumes { Write-Host "[*] Docker volumes (with size):" -ForegroundColor Cyan; docker system df -v }
function RemoveComposeVolumes { Write-Host "[*] Removing service and associated compose volumes..." -ForegroundColor Cyan; Invoke-Compose down -v; Write-Host "[OK] Compose volumes removed." -ForegroundColor Green }
function RemoveSingleVolume { if ([string]::IsNullOrWhiteSpace($VolumeName)) { throw "For action 'volume-rm', provide -VolumeName <name>." }; Write-Host "[*] Removing volume '$VolumeName'..." -ForegroundColor Cyan; docker volume rm $VolumeName; Write-Host "[OK] Volume '$VolumeName' removed." -ForegroundColor Green }

function GetAppVersion {
    if (-not (Test-Path $EnvFile)) { throw "Missing .env file at $EnvFile" }
    $line = Get-Content $EnvFile | Where-Object { $_ -match '^APP_VERSION=' } | Select-Object -First 1
    if (-not $line) { throw "APP_VERSION is not defined in $EnvFile" }
    return ($line -split '=', 2)[1].Trim()
}

function GetImageName {
    if (-not (Test-Path $ComposeFile)) { throw "Missing docker-compose file at $ComposeFile" }
    $line = Get-Content $ComposeFile | Where-Object { $_ -match '^\s*image:\s*' } | Select-Object -First 1
    if (-not $line) { throw "No 'image:' entry found in $ComposeFile. Add explicit image name before tagging." }
    return ($line -replace '^\s*image:\s*', '').Trim()
}

function Tag {
    $image = GetImageName
    $version = GetAppVersion
    $repo = ($image -split ':', 2)[0]
    $taggedImage = "${repo}:${version}"
    Write-Host "[*] Tagging image '$image' as '$taggedImage'..." -ForegroundColor Cyan
    docker image inspect $image | Out-Null
    docker tag $image $taggedImage
    Write-Host "[OK] Tagged image as $taggedImage" -ForegroundColor Green
}

function BuildTag { Build; Tag }

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
