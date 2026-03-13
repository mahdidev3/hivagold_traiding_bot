param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet("apply", "update", "delete", "get-all", "check-all", "status", "sync-images", "load-images", "prepare", "help")]
    [string]$Action,

    [Parameter(Position = 1)]
    [string]$Target = "all"
)

$ErrorActionPreference = "Stop"
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $ScriptRoot "..")
$BasePath = Join-Path $ScriptRoot "base"

$Workers = @{
    "api-server" = @{ File = "api-server.yaml"; Env = "workers/api_server/.env"; Image = "hivagold-api-server" }
    "bot-auth-worker" = @{ File = "bot-auth-worker.yaml"; Env = "workers/bot_auth_worker/.env"; Image = "bot-auth-worker" }
    "bot-captcha-worker" = @{ File = "bot-captcha-worker.yaml"; Env = "workers/bot_captcha_worker/.env"; Image = "bot-captcha-worker" }
    "bot-room-worker" = @{ File = "bot-room-worker.yaml"; Env = "workers/bot_room_worker/.env"; Image = "bot-room-worker" }
    "bot-trading-worker" = @{ File = "bot-trading-worker.yaml"; Env = "workers/bot_trading_worker/.env"; Image = "bot-trading-worker" }
}

function EnsureKubectl {
    if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
        throw "kubectl is required but was not found in PATH."
    }
}

function EnsureDocker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        throw "docker is required but was not found in PATH."
    }
}

function IsMinikubeContext {
    EnsureKubectl
    $ctx = kubectl config current-context
    return $ctx -like "minikube*"
}

function ResolveTarget {
    param([string]$Name)

    if ($Name -eq "all") {
        return @("api-server", "bot-auth-worker", "bot-captcha-worker", "bot-room-worker", "bot-trading-worker")
    }

    if (-not $Workers.ContainsKey($Name)) {
        throw "Unknown target '$Name'. Use one of: all, $($Workers.Keys -join ', ')."
    }

    return @($Name)
}

function GetAppVersion {
    param([string]$EnvRelativePath)

    $envPath = Join-Path $RepoRoot $EnvRelativePath
    if (-not (Test-Path $envPath)) {
        throw "Missing env file: $envPath"
    }

    $line = Get-Content $envPath | Where-Object { $_ -match '^APP_VERSION=' } | Select-Object -First 1
    if (-not $line) {
        throw "APP_VERSION is missing in $envPath"
    }

    return ($line -split '=', 2)[1].Trim()
}

function SyncImageTags {
    param([string[]]$Names)

    foreach ($name in $Names) {
        $meta = $Workers[$name]
        $version = GetAppVersion -EnvRelativePath $meta.Env
        $yamlPath = Join-Path $BasePath $meta.File
        $taggedImage = "$($meta.Image):$version"

        $content = Get-Content $yamlPath -Raw
        $updated = [Regex]::Replace($content, 'image:\s*[^\r\n]+', "image: $taggedImage", 1)
        Set-Content -Path $yamlPath -Value $updated -NoNewline

        Write-Host "[OK] $name -> $taggedImage" -ForegroundColor Green
    }
}

function LoadImagesToMinikube {
    param([string[]]$Names)

    EnsureDocker

    $isMinikube = IsMinikubeContext
    $hasMinikubeCommand = [bool](Get-Command minikube -ErrorAction SilentlyContinue)

    if ($isMinikube -and -not $hasMinikubeCommand) {
        throw "Current kubectl context is Minikube but 'minikube' command was not found."
    }

    foreach ($name in $Names) {
        $meta = $Workers[$name]
        $version = GetAppVersion -EnvRelativePath $meta.Env
        $taggedImage = "$($meta.Image):$version"

        docker image inspect $taggedImage *> $null
        if ($LASTEXITCODE -ne 0) {
            throw "Local image '$taggedImage' not found. Build it first in Docker Desktop before Kubernetes actions."
        }

        if ($isMinikube) {
            Write-Host "[*] Loading $taggedImage into Minikube from local Docker daemon..." -ForegroundColor Cyan
            minikube image load $taggedImage --overwrite=true
            Write-Host "[OK] Loaded into Minikube: $taggedImage" -ForegroundColor Green
        }
        else {
            Write-Host "[WARN] Context is not Minikube. Verified local Docker image exists: $taggedImage" -ForegroundColor Yellow
        }
    }
}

function PrepareImages {
    param([string[]]$Names)

    SyncImageTags -Names $Names
    LoadImagesToMinikube -Names $Names
}

function ApplyTarget {
    param([string[]]$Names)

    EnsureKubectl
    PrepareImages -Names $Names

    if ($Names.Count -eq 5) {
        Write-Host "[*] Applying full base manifests..." -ForegroundColor Cyan
        kubectl apply -k $BasePath
    }
    else {
        foreach ($name in $Names) {
            $file = Join-Path $BasePath $Workers[$name].File
            Write-Host "[*] Applying $name..." -ForegroundColor Cyan
            kubectl apply -f $file
        }
    }
}

function DeleteTarget {
    param([string[]]$Names)

    EnsureKubectl

    if ($Names.Count -eq 5) {
        Write-Host "[*] Deleting full base manifests..." -ForegroundColor Cyan
        kubectl delete -k $BasePath
    }
    else {
        foreach ($name in $Names) {
            $file = Join-Path $BasePath $Workers[$name].File
            Write-Host "[*] Deleting $name..." -ForegroundColor Cyan
            kubectl delete -f $file
        }
    }
}

function GetAll {
    EnsureKubectl
    kubectl get all -n hivagold
}

function CheckAll {
    EnsureKubectl
    kubectl get deployments,pods,svc,ingress -n hivagold -o wide
}

function Status {
    param([string[]]$Names)

    EnsureKubectl
    foreach ($name in $Names) {
        kubectl rollout status deployment/$name -n hivagold
    }
}

function ShowHelp {
    Write-Host "Usage: ./manage.ps1 <action> [target]" -ForegroundColor Yellow
    Write-Host "" 
    Write-Host "Actions:" -ForegroundColor Yellow
    Write-Host "  sync-images        Update image tags in YAMLs from each worker .env APP_VERSION"
    Write-Host "  load-images        Verify Docker Desktop images exist and load them into Minikube (offline/local)"
    Write-Host "  prepare            sync-images + load-images"
    Write-Host "  apply all          Sync and apply all manifests (kubectl apply -k)"
    Write-Host "  update <name>      Prepare images and apply only one worker deployment YAML"
    Write-Host "  delete all         Delete all manifests in base"
    Write-Host "  delete <name>      Delete one worker deployment YAML"
    Write-Host "  get-all            kubectl get all -n hivagold"
    Write-Host "  check-all          Quick health table for deployments/pods/services/ingress"
    Write-Host "  status all         rollout status for all deployments"
    Write-Host "  status <name>      rollout status for a single deployment"
    Write-Host "" 
    Write-Host "Targets: all | api-server | bot-auth-worker | bot-captcha-worker | bot-room-worker | bot-trading-worker"
}

try {
    switch ($Action) {
        "sync-images" { SyncImageTags -Names (ResolveTarget -Name $Target) }
        "load-images" { LoadImagesToMinikube -Names (ResolveTarget -Name $Target) }
        "prepare" { PrepareImages -Names (ResolveTarget -Name $Target) }
        "apply" { ApplyTarget -Names (ResolveTarget -Name $Target) }
        "update" { ApplyTarget -Names (ResolveTarget -Name $Target) }
        "delete" { DeleteTarget -Names (ResolveTarget -Name $Target) }
        "get-all" { GetAll }
        "check-all" { CheckAll }
        "status" { Status -Names (ResolveTarget -Name $Target) }
        "help" { ShowHelp }
    }
}
catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
