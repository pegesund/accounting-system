# Accounting System - Frontend Micro Architecture

## Overview

React-based accounting system frontend using micro frontends (Module Federation). Each feature area is independently developed and deployable.

## Architecture
```
/accounting-system
  /apps
    /shell              # Host app - layout, routing, auth UI
    /invoicing          # Invoice management
    /expenses           # Expense tracking
    /reports            # Financial reports
    /clients            # Client management
    /dashboard          # Overview dashboard
  /packages
    /design-system      # Shared UI components
    /shared-types       # TypeScript interfaces
```

## Feature Breakdown

### Shell (Host)
**Port:** 4200  
**Owns:** Layout, navigation, auth UI, routing, error boundaries

**Exposes:**
- `./AuthContext` - Auth state (logged in user, token storage)
- `./Navigation` - Routing utilities

### Dashboard MFE
**Port:** 4201  
**Route:** `/`  
**Features:** Overview, quick stats, recent activity widgets

### Invoicing MFE
**Port:** 4202  
**Route:** `/invoices/*`  
**Features:** Create/edit invoices, invoice list, invoice detail, templates

### Expenses MFE
**Port:** 4203  
**Route:** `/expenses/*`  
**Features:** Record expenses, categories, receipts, approval workflow

### Reports MFE
**Port:** 4204  
**Route:** `/reports/*`  
**Features:** P&L, balance sheet, cash flow, custom reports

### Clients MFE
**Port:** 4205  
**Route:** `/clients/*`  
**Features:** Client directory, contact info, billing history

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Setup
```bash
# Install Nx
npm install -g nx

# Create workspace
npx create-nx-workspace@latest accounting-system \
  --preset=react-monorepo \
  --packageManager=pnpm

cd accounting-system

# Generate shell (host)
nx g @nx/react:host shell --directory=apps/shell

# Generate MFEs
nx g @nx/react:remote dashboard --host=shell --directory=apps/dashboard
nx g @nx/react:remote invoicing --host=shell --directory=apps/invoicing
nx g @nx/react:remote expenses --host=shell --directory=apps/expenses
nx g @nx/react:remote reports --host=shell --directory=apps/reports
nx g @nx/react:remote clients --host=shell --directory=apps/clients

# Generate shared libraries
nx g @nx/js:library design-system --directory=packages/design-system
nx g @nx/js:library shared-types --directory=packages/shared-types
```

### Run Development
```bash
# Run all apps
nx run-many --target=serve --all

# Or run individually
nx serve shell          # Shell on :4200
nx serve invoicing      # Invoicing on :4201
```

Visit `http://localhost:4200`

## Module Federation Config

### Shell exposes shared services:
```javascript
// apps/shell/module-federation.config.js
module.exports = {
  name: 'shell',
  exposes: {
    './AuthContext': './src/contexts/AuthContext.tsx',
    './Navigation': './src/utils/navigation.ts'
  },
  shared: {
    react: { singleton: true, eager: true },
    'react-dom': { singleton: true, eager: true },
    'react-router-dom': { singleton: true }
  }
};
```

### MFE consumes from shell:
```javascript
// apps/invoicing/module-federation.config.js
module.exports = {
  name: 'invoicing',
  remotes: ['shell'],
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    'react-router-dom': { singleton: true }
  }
};
```

## Routing

**Shell handles top-level routes:**
```typescript
// apps/shell/src/app/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('dashboard/Module'));
const Invoicing = lazy(() => import('invoicing/Module'));
const Expenses = lazy(() => import('expenses/Module'));
const Reports = lazy(() => import('reports/Module'));
const Clients = lazy(() => import('clients/Module'));

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices/*" element={<Invoicing />} />
            <Route path="/expenses/*" element={<Expenses />} />
            <Route path="/reports/*" element={<Reports />} />
            <Route path="/clients/*" element={<Clients />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
```

**MFEs handle nested routes:**
```typescript
// apps/invoicing/src/app/App.tsx
import { Routes, Route } from 'react-router-dom';

export function App() {
  return (
    <Routes>
      <Route index element={<InvoiceList />} />
      <Route path="new" element={<CreateInvoice />} />
      <Route path=":id" element={<InvoiceDetail />} />
      <Route path=":id/edit" element={<EditInvoice />} />
    </Routes>
  );
}
```

## Authentication (Frontend Only)

**Shell provides auth context:**
```typescript
// apps/shell/src/contexts/AuthContext.tsx
import { createContext, useState } from 'react';

interface AuthContextValue {
  user: User | null;
  login: (credentials: Credentials) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue>(null!);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  
  const login = (credentials: Credentials) => {
    // Handle login (save token, set user)
    // You'll implement backend calls later
    setUser({ id: 1, name: 'Demo User' });
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**MFEs consume auth:**
```typescript
// In any MFE
import { useContext } from 'react';
import { AuthContext } from 'shell/AuthContext';

function InvoiceList() {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome {user.name}</div>;
}
```

## Design System

**Create shared components:**
```typescript
// packages/design-system/src/Button.tsx
import styles from './Button.module.css';

export function Button({ children, variant = 'primary', ...props }) {
  return (
    <button className={styles[variant]} {...props}>
      {children}
    </button>
  );
}

// packages/design-system/src/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
```

**Use in MFEs:**
```typescript
import { Button, Card } from '@accounting-system/design-system';

function InvoiceForm() {
  return (
    <Card>
      <h2>New Invoice</h2>
      <Button variant="primary">Save</Button>
    </Card>
  );
}
```

## Styling

**Use CSS Modules (built-in, scoped automatically):**
```css
/* InvoiceList.module.css */
.container {
  padding: 20px;
}

.card {
  border: 1px solid #ddd;
  margin: 10px 0;
}
```
```typescript
// InvoiceList.tsx
import styles from './InvoiceList.module.css';

function InvoiceList() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>Invoice 1</div>
    </div>
  );
}
```

## Communication Between MFEs

**Minimize communication! When needed:**
```typescript
// Option 1: Custom events
window.dispatchEvent(new CustomEvent('invoice:created', {
  detail: { invoiceId: 123 }
}));

// Option 2: URL navigation
import { useNavigate } from 'react-router-dom';
navigate('/clients/123');

// Option 3: Shared context (only for global state like auth)
import { AuthContext } from 'shell/AuthContext';
```

## Build & Deploy
```bash
# Build specific MFE
nx build invoicing --configuration=production

# Build all
nx run-many --target=build --all

# Output in dist/apps/*
```

Each MFE can deploy to separate URL:
- Shell: `https://app.accounting-system.com`
- Invoicing: `https://invoicing.accounting-system.com`
- Expenses: `https://expenses.accounting-system.com`

## Key Principles

✅ **Shell is thin** - only layout, routing, auth UI  
✅ **MFEs are independent** - can develop/deploy separately  
✅ **Minimize communication** - MFEs work in isolation  
✅ **Shared design system** - consistent UI across features  
✅ **CSS Modules** - automatic scoping, no collisions  

## Start Building

**Phase 1:** Setup monorepo with Nx  
**Phase 2:** Build shell with basic layout and routing  
**Phase 3:** Create one MFE (Dashboard) as proof of concept  
**Phase 4:** Add design system with Button, Input, Card  
**Phase 5:** Add remaining MFEs incrementally  

**Backend integration comes later** - focus on structure first!


# USE tailwind everywhere

# keep all documentation in a doc folder, except claude.md

# create a common library for all mfe-s, here create a funciton isLoggedIn (return yes for now)
