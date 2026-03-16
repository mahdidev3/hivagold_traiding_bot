param(
    [Parameter(Mandatory=$true)]
    [string]$Mode
)

switch ($Mode) {
    "local" { python run.py }
    default {
        Write-Host "Usage: ./management/manage.ps1 -Mode local"
        exit 1
    }
}
