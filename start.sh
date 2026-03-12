#!/bin/bash
# Start D&D Game Assistant — web server + Claude Max API Proxy

DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo ""
  echo "Shutting down..."
  kill $PROXY_PID $WEB_PID 2>/dev/null
  wait $PROXY_PID $WEB_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Start Claude Max API Proxy
echo "Starting Claude Max API Proxy on port 3456..."
claude-max-api &
PROXY_PID=$!

# Wait for proxy to be ready
echo "Waiting for proxy..."
for i in {1..10}; do
  curl -s http://localhost:3456/health > /dev/null 2>&1 && break
  sleep 1
done

# Start web server
echo "Starting web server on port 3000..."
cd "$DIR/web" && node server.js &
WEB_PID=$!

echo ""
echo "D&D Game Assistant ready at http://localhost:3000"
echo "Press Ctrl+C to stop"

wait
