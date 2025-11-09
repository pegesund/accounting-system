#!/bin/bash

# Start script for Accounting System Micro Frontends
# This script starts all MFEs and the shell app

echo "🚀 Starting Accounting System..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Create a PID file directory
mkdir -p .pids

# Function to start an MFE in preview mode (serves built files)
start_mfe() {
    local app_name=$1
    local app_port=$2

    echo "Starting $app_name on port $app_port..."
    cd "apps/$app_name"
    pnpm run preview > "../../.pids/${app_name}.log" 2>&1 &
    local pid=$!
    echo $pid > "../../.pids/${app_name}.pid"
    cd "$SCRIPT_DIR"
    echo "  ✓ $app_name started (PID: $pid)"
}

# Function to start shell in dev mode (HMR)
start_shell() {
    local app_name=$1
    local app_port=$2

    echo "Starting $app_name on port $app_port..."
    cd "apps/$app_name"
    pnpm run dev > "../../.pids/${app_name}.log" 2>&1 &
    local pid=$!
    echo $pid > "../../.pids/${app_name}.pid"
    cd "$SCRIPT_DIR"
    echo "  ✓ $app_name started (PID: $pid)"
}

# Start all MFEs first (they need to be running before shell)
echo "📦 Starting Micro Frontends (preview mode - serving built files)..."
start_mfe "dashboard" 4201
start_mfe "invoicing" 4202
start_mfe "expenses" 4203
start_mfe "reports" 4204
start_mfe "clients" 4205

echo ""
echo "⏳ Waiting 5 seconds for MFEs to initialize..."
sleep 5

# Start the shell (host) app
echo ""
echo "🏠 Starting Shell (Host) App (dev mode - HMR enabled)..."
start_shell "shell" 4200

echo ""
echo "✅ All services started!"
echo ""
echo "📊 Service Status:"
echo "  Shell:     http://localhost:4200"
echo "  Dashboard: http://localhost:4201"
echo "  Invoicing: http://localhost:4202"
echo "  Expenses:  http://localhost:4203"
echo "  Reports:   http://localhost:4204"
echo "  Clients:   http://localhost:4205"
echo ""
echo "📝 Logs are available in .pids/*.log"
echo "🛑 To stop all services, run: ./stopme.sh"
echo ""
