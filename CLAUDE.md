# Project Instructions for Accounting System

## Project Overview

This is a multi-tenant accounting system built with a **Micro-Frontend (MFE) architecture** using Module Federation. Each application in `apps/` is an independently deployable micro-frontend that can be developed, tested, and deployed separately.

---

## Architecture

### Structure
- **`apps/`** - Independent MFE applications (dashboard, invoicing, expenses, reports, clients, settings, shell)
- **`packages/`** - Shared utilities and components used across MFEs
- **`tests/`** - Selenium-based integration tests

### Key Principles
- Each MFE is independently buildable and deployable
- MFEs communicate through well-defined contracts
- Shared code must go in `packages/`, not duplicated across apps
- Don't break MFE boundaries or contracts

---

## Backend API Integration

### Critical Rules

**ALWAYS read the backend API documentation FIRST:**
- API docs location: `../../snabel_backend/docs/API.md`
- Backend runs at: **http://localhost:8080**
- Check existing APIs before implementing workarounds

### When APIs Are Missing

If you need an API that doesn't exist:
1. **Document it immediately** in `../../snabel_backend/docs/missing_api.md`
2. Include:
   - What the API should do
   - Why you need it
   - Expected request/response format
   - Use case description

### API Design Thinking

**Think logically about API usage:**
- ❌ Don't traverse long lists through multiple API calls (N+1 problem)
- ✅ Request a batch API or filtered endpoint instead
- ❌ Don't make excessive API calls in loops
- ✅ Ask for aggregated endpoints that return what you need in one call

**Example:**
```
Bad:  Fetch all invoices, then fetch each client individually
Good: Request "invoices with client data included" API
```

---

## Development Workflow

### Building MFEs
- Build specific MFE: `pnpm --filter <app-name> run build`
- Example: `pnpm --filter dashboard run build`
- Don't build all MFEs unnecessarily

### Testing Changes
- Test in the actual MFE you're modifying
- Run the shell app to test MFE integration
- Update Selenium tests when changing UI flows
- Test in multiple languages (en, pl, ua)

### Before Committing
- Ensure the MFE builds successfully
- Run relevant tests
- Check that you haven't broken other MFEs
- Verify changes in dev mode

---

## Code Quality Standards

### TypeScript
- Use TypeScript strict mode (already configured)
- Provide proper types, avoid `any`
- Follow existing type patterns in the codebase

### Component Development
- **Check for existing components first** - don't duplicate
- Follow functional component patterns (React hooks)
- Reuse components from `packages/` when possible
- Keep components focused and single-purpose

### Styling
- Use Tailwind CSS (already configured)
- Follow existing Tailwind patterns
- Keep styles consistent with other MFEs

### Internationalization
- System supports: English (en), Polish (pl), Ukrainian (ua)
- Use existing i18n setup for all user-facing text
- Add translations to all language files when adding new text

---

## What NOT to Do

### Backend Integration
- ❌ Don't bypass existing APIs with workarounds
- ❌ Don't create duplicate API calls across components
- ❌ Don't ignore API errors or fail silently
- ❌ Don't make N+1 query patterns

### Architecture
- ❌ Don't create duplicate functionality across MFEs
- ❌ Don't break shared package contracts
- ❌ Don't bypass the MFE architecture
- ❌ Don't ignore existing architectural patterns

### Code Quality
- ❌ Don't commit without testing builds
- ❌ Don't skip TypeScript type checking
- ❌ Don't create inline styles when Tailwind works
- ❌ Don't duplicate code - create shared utilities

### Security
- ❌ Don't commit .env files or credentials
- ❌ Don't bypass authentication
- ❌ Don't trust user input without validation

---

## Best Practices

### When Starting a Task
1. Read the relevant API documentation
2. Check for existing similar implementations in other MFEs
3. Identify which MFE(s) you'll be working in
4. Check if shared utilities already exist in `packages/`
5. Plan your API usage - batch calls when possible

### During Development
- Follow existing code patterns
- Keep MFE boundaries clear
- Minimize bundle sizes
- Consider performance implications
- Update tests as you go

### When You Need Help
- Check similar implementations in other MFEs
- Review the backend API docs
- Look at existing components before creating new ones
- Ask before making major architectural changes

### Documentation
- Update README when adding new features
- Document new MFE apps in main docs
- Keep the API wishlist updated
- Add code comments for complex logic

---

## Performance Considerations

- MFEs should load efficiently
- Minimize bundle sizes
- Don't over-fetch data from backend
- Use lazy loading where appropriate
- Optimize images and assets

---

## Testing Requirements

- Selenium tests exist - update them when changing UI flows
- Test user workflows, not just units
- Test in all supported languages
- Verify MFE integration in the shell app

---

## File Organization

### New Components
- Reusable components → `packages/`
- MFE-specific components → `apps/<mfe-name>/src/components/`

### Shared Utilities
- General utilities → `packages/utils/`
- Check if utility already exists before creating

### Documentation
- API documentation → `../../snabel_backend/docs/`
- Missing APIs → `../../snabel_backend/docs/missing_api.md`
- Project docs → Root README files

---

## Remember

- Backend API is at **http://localhost:8080**
- Always check `../../snabel_backend/docs/API.md` first
- Document missing APIs in `missing_api.md`
- Think about API efficiency - batch operations when possible
- Follow MFE architecture principles
- Test your changes before committing
