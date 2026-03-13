param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("build", "up", "down", "restart", "logs", "all", "volumes", "volumes-rm", "volume-rm")]
    [string]$Action,
    [string]$VolumeName
)

$ErrorActionPreference = "Stop"

function Build { Write-Host "[*] Building portfolio worker" -ForegroundColor Cyan; docker-compose build }
function Up {
    Write-Host "[*] Starting portfolio worker" -ForegroundColor Cyan
    docker-compose up -d
    Write-Host "[OK] Portfolio worker started. API: http://localhost:8007" -ForegroundColor Green
}
function Down { Write-Host "[*] Stopping portfolio worker" -ForegroundColor Cyan; docker-compose down }
function Restart { docker-compose restart }
function Logs { docker-compose logs -f portfolio-worker }
function All { Build; Up; Logs }
function ShowVolumes { docker system df -v }
function RemoveComposeVolumes { docker-compose down -v }
function RemoveSingleVolume {
    if ([string]::IsNullOrWhiteSpace($VolumeName)) { throw "For action 'volume-rm', provide -VolumeName <name>." }
    docker volume rm $VolumeName
}

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
