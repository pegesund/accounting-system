# Accounting System - Micro Frontend Architecture

A React-based accounting system built with Module Federation and micro frontends. Each feature area is independently developed and deployable.

## Architecture

```
/accounting-system
  /apps
    /shell              # Host app (port 4200) - layout, routing, auth UI
    /dashboard          # Dashboard MFE (port 4201)
    /invoicing          # Invoice management (port 4202)
    /expenses           # Expense tracking (port 4203)
    /reports            # Financial reports (port 4204)
    /clients            # Client management (port 4205)
  /packages
    /design-system      # Shared UI components (Button, Card, Input)
    /shared-types       # TypeScript interfaces
    /common             # Common utilities (isLoggedIn function)
  /docs
    /architecture.md    # Detailed architecture documentation
```

## Features

- **Module Federation**: Each MFE can be developed and deployed independently
- **Shared Components**: Design system with reusable UI components
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **React Router**: Client-side routing with lazy-loaded MFEs
- **Authentication Context**: Centralized auth state management
- **TypeScript**: Full type safety across all packages

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
cd accounting-system
pnpm install
```

### Development

#### Easy Way (Recommended)

Use the provided scripts to start/stop all services:

```bash
# Start all services (shell + all MFEs)
./startme.sh

# Stop all services
./stopme.sh
```

The `startme.sh` script will:
- Start all 5 MFEs on ports 4201-4205
- Wait for them to initialize
- Start the shell app on port 4200
- Track all PIDs for easy cleanup

Visit http://localhost:4200

#### Manual Way

Build all MFEs first (they need to be built for the shell to load them):

```bash
# Build all MFEs
cd apps/dashboard && pnpm run build && cd ../..
cd apps/invoicing && pnpm run build && cd ../..
cd apps/expenses && pnpm run build && cd ../..
cd apps/reports && pnpm run build && cd ../..
cd apps/clients && pnpm run build && cd ../..
```

Then run the shell app:

```bash
cd apps/shell
pnpm run dev
```

Visit http://localhost:4200

### Production Build

```bash
# Build all apps
cd apps/dashboard && pnpm run build && cd ../..
cd apps/invoicing && pnpm run build && cd ../..
cd apps/expenses && pnpm run build && cd ../..
cd apps/reports && pnpm run build && cd ../..
cd apps/clients && pnpm run build && cd ../..
cd apps/shell && pnpm run build && cd ../..
```

### Preview Production Build

```bash
cd apps/shell
pnpm run preview
```

## Technology Stack

- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **@originjs/vite-plugin-federation** - Module Federation for Vite
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Styling
- **pnpm** - Package manager

## Module Federation Configuration

### Shell (Host App)
- Exposes: None (host only)
- Consumes: All MFEs (dashboard, invoicing, expenses, reports, clients)
- Port: 4200

### MFEs (Remote Apps)
- Each MFE exposes `./Module` pointing to its `App.tsx`
- All share: react, react-dom, react-router-dom
- Ports: 4201-4205

## Project Structure

Each MFE follows this structure:
```
/apps/[mfe-name]/
  /src/
    App.tsx           # Main component (exposed via Module Federation)
    main.tsx          # Entry point
    index.css         # Tailwind imports
  vite.config.ts      # Module Federation config
  package.json
```

## Shared Libraries

### Design System (`@accounting-system/design-system`)
Provides reusable UI components:
- Button (primary, secondary, danger variants)
- Card
- Input

### Common (`@accounting-system/common`)
Common utilities:
- `isLoggedIn()` - Returns true (placeholder for actual auth logic)

### Shared Types (`@accounting-system/shared-types`)
TypeScript interfaces:
- User
- AuthContextValue
- Credentials

## Testing

The application is up and running. You can test it with:

```bash
# Check if shell is running
curl -I http://localhost:4200

# Get the HTML
curl http://localhost:4200
```

## Next Steps

1. **Backend Integration**: Connect to actual API endpoints
2. **Real Authentication**: Implement proper login/logout with JWT
3. **State Management**: Add Redux or Zustand if needed
4. **Testing**: Add unit and integration tests with Vitest
5. **CI/CD**: Set up deployment pipelines
6. **MFE Development**: Develop full features for each micro frontend

## Documentation

See `docs/architecture.md` for detailed architecture documentation.

## License

ISC
