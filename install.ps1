$ErrorActionPreference = "Stop"

Write-Host "=== DnD Game Assistant - Setup ==="
Write-Host ""

# 1. Install web dependencies
Write-Host "Installing web dependencies..."
Push-Location web
npm install
Pop-Location
Write-Host "Web dependencies installed."
Write-Host ""

# 2. Clone and build dnd-mcp (D&D 5e rules lookup)
if (Test-Path "dnd-mcp") {
    Write-Host "dnd-mcp/ already exists, skipping clone."
} else {
    Write-Host "Cloning dnd-mcp (D&D 5e rules via Open5e API)..."
    git clone https://github.com/heffrey78/dnd-mcp.git
}

Write-Host "Building dnd-mcp..."
Push-Location dnd-mcp
npm install
npm run build
Pop-Location
Write-Host "dnd-mcp built successfully."
Write-Host ""

# 3. Set up .mcp.json from template
if (Test-Path ".mcp.json") {
    Write-Host "Note: .mcp.json already exists, skipping copy."
    Write-Host "  If you want to reset it, run: Copy-Item .mcp.json.template .mcp.json"
} else {
    Write-Host "Creating .mcp.json from template..."
    Copy-Item .mcp.json.template .mcp.json
    Write-Host ".mcp.json created."
}

# 4. Install claude-max-api-proxy globally
Write-Host "Installing claude-max-api-proxy..."
# Load nvm for Windows (nvm-windows) if available
if (Get-Command nvm -ErrorAction SilentlyContinue) {
    nvm install
}
npm install -g claude-max-api-proxy
Write-Host "claude-max-api-proxy installed."
Write-Host ""

Write-Host ""
Write-Host "=== Setup complete! ==="
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Restart Claude Code to pick up the new MCP servers"
Write-Host "  2. Run .\start.ps1 to launch the web viewer"
