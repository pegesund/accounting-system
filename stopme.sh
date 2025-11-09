#!/bin/bash

# Stop script for Accounting System Micro Frontends
# This script stops all running MFEs and the shell app

echo "🛑 Stopping Accounting System..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to stop an app
stop_app() {
    local app_name=$1
    local pid_file=".pids/${app_name}.pid"

    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping $app_name (PID: $pid)..."
            kill $pid 2>/dev/null

            # Wait up to 5 seconds for graceful shutdown
            for i in {1..5}; do
                if ! ps -p $pid > /dev/null 2>&1; then
                    break
                fi
                sleep 1
            done

            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                echo "  Force killing $app_name..."
                kill -9 $pid 2>/dev/null
            fi

            echo "  ✓ $app_name stopped"
        else
            echo "  ⚠ $app_name not running (PID: $pid)"
        fi
        rm "$pid_file"
    else
        echo "  ⚠ No PID file found for $app_name"
    fi
}

# Stop the shell first
echo "🏠 Stopping Shell (Host) App..."
stop_app "shell"

echo ""
echo "📦 Stopping Micro Frontends..."
stop_app "dashboard"
stop_app "invoicing"
stop_app "expenses"
stop_app "reports"
stop_app "clients"

# Clean up log files
echo ""
echo "🧹 Cleaning up..."
if [ -d ".pids" ]; then
    rm -f .pids/*.log
    echo "  ✓ Log files removed"
fi

# Also kill any stray Node/Vite processes on our ports (but not browsers)
echo ""
echo "🔍 Checking for stray Node processes..."
for port in 4200 4201 4202 4203 4204 4205; do
    # Only kill node processes, not browsers
    pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        for pid in $pids; do
            # Check if it's a node process
            proc_name=$(ps -p $pid -o comm= 2>/dev/null)
            if [[ "$proc_name" == "node" ]] || [[ "$proc_name" == *"vite"* ]] || [[ "$proc_name" == *"pnpm"* ]]; then
                echo "  Found $proc_name process on port $port (PID: $pid), killing..."
                kill -9 $pid 2>/dev/null
                echo "  ✓ Process on port $port killed"
            fi
        done
    fi
done

echo ""
echo "✅ All services stopped!"
echo ""
