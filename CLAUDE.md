# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build production version
- `npm run lint` - Lint both Next.js app and Convex functions (`--dir . --dir convex`)
- `npm run test:once` - Run tests once and exit (preferred for CI/automated testing)
- `npm run test` - Run tests in watch mode with Vitest (development only)

### Convex Backend
- `npx convex dev` - Start Convex development environment, watch for changes, deploy functions
- `npx convex dev --once` - Deploy functions once without watching
- `npx convex dashboard` - Open Convex dashboard in browser

### Stripe Integration
- `npm run stripe:listen` - Listen for Stripe webhooks (requires Stripe CLI)
- `npm run stripe:trigger` - Trigger test payment events

### Testing Specific Files
- `npm run test:once convex/users.test.ts` - Run specific Convex test file
- `npm run test:once src/components/` - Run tests for specific directory

### Custom Claude Code Commands
- `/build-fix` - Run npm run build and automatically fix any TypeScript or build errors
- `/build-fix --lint` - Run build, fix errors, then run linting

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- **Backend**: Convex (database, API, file storage, real-time sync)
- **Authentication**: convex-auth authentication
- **Payments**: Stripe with webhook-driven credit system
- **Testing**: Vitest + React Testing Library + convex-test
- **UI Components**: Radix UI primitives with custom styling

### Next.js Usage Pattern
This application uses Next.js in a **client-side only** architecture:

- **No API Routes**: Next.js API routes (`app/api/`) are not used - Convex handles all backend functionality
- **No Server Components**: All React components are client-side components using Convex hooks for data fetching (except for pre-rendered public marketing routes)
- **Static Generation Only**: Next.js is used purely for static site generation of public pages (landing, legal pages) for SEO benefits
- **Single Page Application**: The actual application in `src/app/` functions as an SPA with client-side routing
- **Convex Backend**: All dynamic functionality (auth, database, file storage, real-time sync) is handled by Convex

### Service-Oriented Architecture
The codebase uses a service layer pattern in Convex:

**Frontend → Convex Services → Database**

Key services in `convex/services/`:
- `UserService` - User management and credit operations
- `StripeService` - Payment processing and webhook handling
- `ImageService` - File uploads and image management
- `HttpService` - Webhook processing (Clerk user sync)

### Authentication Flow
1. **Convex Auth** (`@convex-dev/auth`) handles authentication with Google OAuth provider
2. **Google OAuth** configured in `convex/auth.ts` using `@auth/core/providers/google`
3. **JWT validation** via `convex/auth.config.ts` for secure session management
4. **Frontend hooks** use `useAuthActions`, `Authenticated`, `Unauthenticated` from `@convex-dev/auth/react`
5. **Middleware** (`src/middleware.ts`) protects routes
6. **User sync** automatic user creation on first authentication

### Credit-Based Payment System
- Users get default credits on signup (configurable via `DEFAULT_CREDITS`)
- Image uploads cost 1 credit each
- Stripe integration with 3 pricing tiers
- Webhook-driven credit fulfillment via `convex/stripe.ts`
- Purchase tracking in `userPurchases` table

### File Upload System
- **React Dropzone** for file selection
- **Convex Storage** for file storage with SHA256 deduplication
- **Size limits** enforced via `NEXT_PUBLIC_UPLOAD_SIZE_LIMIT`
- **Cron cleanup** removes unused files (`convex/crons.ts`)

## Key Configuration Files

### Environment Variables
- `src/nextEnv.ts` - Frontend environment validation with TypeScript
- `convex/lib/convexEnv.ts` - Backend environment validation
- `.env.local` - Local environment values

Required environment variables:
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `AUTH_GOOGLE_ID` - Google OAuth client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth client secret
- `JWKS` - JWT signing keys for auth validation
- Stripe price IDs and credit amounts for 3 tiers
- `NEXT_PUBLIC_UPLOAD_SIZE_LIMIT` - File upload size limit

### Database Schema
Located in `convex/schema.ts`:
- `users` - User accounts with credits
- `images` - Uploaded images with metadata
- `userPurchases` - Stripe purchase tracking
- Rate limiting tables for abuse prevention

## Development Patterns

### Component Structure
- **UI Components**: `src/components/ui/` (Radix primitives)
- **Feature Components**: `src/app/` (colocation with routes)
- **Hooks**: `src/hooks/` (custom React hooks)
- **Upload System**: `src/components/upload-zone/` (file upload logic)

### Error Handling
- `useMutationErrorHandler` hook for consistent error display
- `ConvexError` for typed backend errors
- Toast notifications via `src/hooks/use-toast.ts`

### Testing Setup
- **Vitest** configured with dual environments: jsdom (frontend) and edge-runtime (Convex)
- **Environment matching**: Frontend tests (`src/**/*.test.{ts,tsx}`) use jsdom, Convex tests (`convex/**/*.test.ts`) use edge-runtime
- **convex-test** for backend function testing with dependency inlining
- **JUnit reporting** for CI/CD with output to `./junit.xml`
- Setup file: `src/test/setup.ts` (configures testing-library)
- Mock environment variables in tests using `vi.mock()`

### Rate Limiting
- Token bucket algorithm (10 requests/minute, capacity 15)
- Implemented via `convex-helpers` ratelimits
- Applied to image upload endpoints

## File Organization

### Frontend (`src/`)
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and route definitions

### Backend (`convex/`)
- `services/` - Business logic layer (all database operations should be implemented here)
- `lib/` - Shared utilities, environment validation, and authentication helpers
- `_generated/` - Auto-generated Convex types (do not edit)
- Root files: API endpoints and cron jobs (should delegate to services)

## UI Component System

### ShadCN Integration
- **Configuration**: `components.json` defines aliases and Tailwind integration
- **Component Library**: Pre-built components in `src/components/ui/` using Radix primitives
- **Import Pattern**: Use `@/components/ui` for UI components
- **Extension Strategy**: Use `class-variance-authority` for component variants, extend rather than modify source components
- **Styling**: CSS variables-based theming with Tailwind utilities

### Component Patterns
- **Naming**: Component files use dash-case naming (e.g., `avatar-dropdown.tsx`)
- **Colocation**: New components should be created next to their parent component
- **Mobile-first**: Follow mobile-first responsive design patterns
- **Class Merging**: Use `cn()` utility for conditional class name merging

### Theming Guidelines
- **Theme Variables**: Always use CSS custom properties defined in `globals.css` via Tailwind theme variables
- **Semantic Colors**: Use semantic color names that describe purpose, not appearance:
  - `text-foreground` / `text-background` - Primary text colors
  - `text-muted-foreground` - Secondary/muted text
  - `bg-background` / `bg-card` - Background colors
  - `text-destructive` / `border-destructive` - Error/danger states
  - `bg-primary` / `text-primary-foreground` - Primary action colors
  - `border-border` / `bg-muted` - UI element borders and backgrounds
- **Dark Mode**: Theme variables automatically handle light/dark mode switching
- **Avoid**: Never use hardcoded colors like `text-gray-500`, `bg-white`, `text-red-500`, `border-gray-300`

## CI/CD Pipeline

### GitHub Actions
- **Workflow**: `.github/workflows/ci.yml` runs on push/PR to master
- **Node Version**: Uses Node.js 20 with npm caching
- **Pipeline Steps**: 
  1. `npm ci` - Install dependencies
  2. `npm run lint` - Lint Next.js and Convex code
  3. `npm run test:once` - Run Vitest tests with JUnit reporting
- **Test Output**: JUnit XML results for CI integration

## Development Guidelines

### Architecture Constraints
- **No React Server Components**: All data fetching is client-side using Convex hooks
- **Client-side Data Flow**: Use `useQuery` and `useMutation` hooks for all data operations
- **Service Layer**: Business logic organized in `convex/services/` directory
- **Service Delegation**: All queries/mutations/actions should delegate implementation to respective services
- **Authentication Helper**: Use `requireAuthentication()` from `convex/lib/helpers.ts` for authenticated endpoints
- **Internal Functions**: All internal mutations/queries should have underscore prefix (e.g., `_exampleOfInternalMutation`)
- **Return Types Required**: All queries, mutations, and actions must include explicit return types in their handler functions (e.g., `handler: async (ctx, args): Promise<ReturnType> => {}`). This improves type safety and makes the API contract clear.
- **TypeScript Strict**: Both frontend and Convex use strict TypeScript configuration

### Code Style Preferences
- **Testing**: Don't write tests unless specifically instructed
- **Components**: Keep small and focused on single responsibility
- **Latest Features**: Prefer using latest language features and library versions
- **Tailwind**: Always use theme variables (`text-foreground`, `bg-background`, `text-muted-foreground`, `text-destructive`, etc.) instead of hardcoded colors. Never use hardcoded color values like `text-gray-500`, `bg-white`, `text-red-500` - use semantic theme variables for consistent theming across light/dark modes

## Important Notes

- **Convex development**: Always run `npx convex dev` when working on backend functions
- **Environment setup**: All required environment variables must be set for build to succeed
- **Rate limiting**: Be aware of 10 requests/minute limit when testing uploads
- **File deduplication**: Files are deduplicated by SHA256 hash to save storage costs
- **Real-time updates**: Convex provides automatic real-time updates to React components
- **TypeScript strict mode**: Both frontend and backend use strict TypeScript configuration