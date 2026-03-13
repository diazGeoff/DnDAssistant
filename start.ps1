# Start D&D Game Assistant - web server + Claude Max API Proxy

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

$ProxyJob = $null
$WebJob = $null

function Cleanup {
    Write-Host ""
    Write-Host "Shutting down..."
    if ($ProxyJob) { Stop-Job $ProxyJob -ErrorAction SilentlyContinue; Remove-Job $ProxyJob -ErrorAction SilentlyContinue }
    if ($WebJob) { Stop-Job $WebJob -ErrorAction SilentlyContinue; Remove-Job $WebJob -ErrorAction SilentlyContinue }
}

try {
    # Start Claude Max API Proxy
    Write-Host "Starting Claude Max API Proxy on port 3456..."
    $ProxyJob = Start-Job -ScriptBlock { claude-max-api }

    # Wait for proxy to be ready
    Write-Host "Waiting for proxy..."
    for ($i = 1; $i -le 10; $i++) {
        try {
            Invoke-RestMethod -Uri "http://localhost:3456/health" -ErrorAction Stop | Out-Null
            break
        } catch {
            Start-Sleep -Seconds 1
        }
    }

    # Start web server
    Write-Host "Starting web server on port 3000..."
    $WebJob = Start-Job -ScriptBlock {
        Set-Location "$using:ScriptDir\web"
        node server.js
    }

    Write-Host ""
    Write-Host "D&D Game Assistant ready at http://localhost:3000"
    Write-Host "Press Ctrl+C to stop"

    # Wait for jobs
    while ($true) {
        Start-Sleep -Seconds 1
        Receive-Job $ProxyJob -ErrorAction SilentlyContinue
        Receive-Job $WebJob -ErrorAction SilentlyContinue
    }
} finally {
    Cleanup
}
