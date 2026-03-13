#!/bin/bash
set -e

echo "=== DnD Game Assistant - Setup ==="
echo ""

# 1. Install web dependencies
echo "Installing web dependencies..."
cd web && npm install && cd ..
echo "Web dependencies installed."
echo ""

# 2. Clone and build dnd-mcp (D&D 5e rules lookup)
if [ -d "dnd-mcp" ]; then
  echo "dnd-mcp/ already exists, skipping clone."
else
  echo "Cloning dnd-mcp (D&D 5e rules via Open5e API)..."
  git clone https://github.com/heffrey78/dnd-mcp.git
fi

echo "Building dnd-mcp..."
cd dnd-mcp && npm install && npm run build && cd ..
echo "dnd-mcp built successfully."
echo ""

# 3. Set up .mcp.json from template
if [ -f ".mcp.json" ]; then
  echo "Note: .mcp.json already exists, skipping copy."
  echo "  If you want to reset it, run: cp .mcp.json.template .mcp.json"
else
  echo "Creating .mcp.json from template..."
  cp .mcp.json.template .mcp.json
  echo ".mcp.json created."
fi

# 4. Install claude-max-api-proxy globally
echo "Installing claude-max-api-proxy..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install
npm install -g claude-max-api-proxy
echo "claude-max-api-proxy installed."
echo ""

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "  1. Restart Claude Code to pick up the new MCP servers"
echo "  2. Run ./start.sh to launch the web viewer"
