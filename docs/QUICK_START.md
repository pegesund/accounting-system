# Quick Start Guide

## Starting the Application

### Option 1: One-Command Start (Recommended)

```bash
./startme.sh
```

This will:
1. Start all 5 micro frontends (ports 4201-4205)
2. Wait 5 seconds for them to initialize
3. Start the shell/host app (port 4200)
4. Display service URLs

**Access the app**: http://localhost:4200

### Option 2: Individual Services

Start services individually in separate terminal windows:

```bash
# Terminal 1 - Dashboard
cd apps/dashboard && pnpm run dev

# Terminal 2 - Invoicing
cd apps/invoicing && pnpm run dev

# Terminal 3 - Expenses
cd apps/expenses && pnpm run dev

# Terminal 4 - Reports
cd apps/reports && pnpm run dev

# Terminal 5 - Clients
cd apps/clients && pnpm run dev

# Terminal 6 - Shell (Host)
cd apps/shell && pnpm run dev
```

## Stopping the Application

### Option 1: One-Command Stop (Recommended)

```bash
./stopme.sh
```

This will:
1. Stop all running services gracefully
2. Clean up PID files and logs
3. Kill any stray processes on ports 4200-4205

### Option 2: Manual Stop

Press `Ctrl+C` in each terminal window where services are running.

## Checking Service Status

### View Logs

Logs are stored in `.pids/*.log`:

```bash
# View shell logs
tail -f .pids/shell.log

# View dashboard logs
tail -f .pids/dashboard.log
```

### Check Running Processes

```bash
# Check what's running on each port
lsof -i :4200
lsof -i :4201
# ... etc
```

### Test with curl

```bash
# Test shell
curl -I http://localhost:4200

# Test all services
for port in 4200 4201 4202 4203 4204 4205; do
  echo "Port $port:"
  curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:$port
done
```

## Service URLs

| Service   | Port | URL                       |
|-----------|------|---------------------------|
| Shell     | 4200 | http://localhost:4200     |
| Dashboard | 4201 | http://localhost:4201     |
| Invoicing | 4202 | http://localhost:4202     |
| Expenses  | 4203 | http://localhost:4203     |
| Reports   | 4204 | http://localhost:4204     |
| Clients   | 4205 | http://localhost:4205     |

## Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :4200

# Kill the process
kill -9 <PID>

# Or use stopme.sh to clean everything
./stopme.sh
```

### MFEs Not Loading in Shell

1. Make sure all MFEs are running before starting shell
2. Check MFE logs for errors: `cat .pids/dashboard.log`
3. Restart everything: `./stopme.sh && ./startme.sh`

### Vite HMR Not Working

This is normal for Module Federation. Changes require manual browser refresh.

## Development Workflow

### Making Changes to MFEs

1. Edit code in any MFE
2. Vite will rebuild automatically
3. Refresh browser to see changes

### Making Changes to Shell

1. Edit code in shell app
2. Vite will rebuild automatically
3. Refresh browser to see changes

### Adding New Shared Components

1. Add component to `packages/design-system/src/`
2. Export from `packages/design-system/src/index.ts`
3. Import in any app: `import { Component } from '@accounting-system/design-system'`

## Production Build

```bash
# Build all apps
cd apps/dashboard && pnpm run build && cd ../..
cd apps/invoicing && pnpm run build && cd ../..
cd apps/expenses && pnpm run build && cd ../..
cd apps/reports && pnpm run build && cd ../..
cd apps/clients && pnpm run build && cd ../..
cd apps/shell && pnpm run build && cd ../..

# Preview production build
cd apps/shell
pnpm run preview
```

## Next Steps

- Check `docs/architecture.md` for detailed architecture info
- See `README.md` for complete documentation
- Explore the codebase structure in `apps/` and `packages/`
