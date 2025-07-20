# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build production version
- `npm run lint` - Lint both Next.js app and Convex functions (`--dir . --dir convex`)
- `npm run test` - Run tests in watch mode with Vitest
- `npm run test:once` - Run tests once and exit

### Convex Backend
- `npx convex dev` - Start Convex development environment, watch for changes, deploy functions
- `npx convex dev --once` - Deploy functions once without watching
- `npx convex dashboard` - Open Convex dashboard in browser

### Stripe Integration
- `npm run stripe:listen` - Listen for Stripe webhooks (requires Stripe CLI)
- `npm run stripe:trigger` - Trigger test payment events

### Testing Specific Files
- `npm run test convex/users.test.ts` - Run specific Convex test file
- `npm run test src/components/` - Run tests for specific directory

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- **Backend**: Convex (database, API, file storage, real-time sync)
- **Authentication**: Clerk with JWT integration
- **Payments**: Stripe with webhook-driven credit system
- **Testing**: Vitest + React Testing Library + convex-test
- **UI Components**: Radix UI primitives with custom styling

### Service-Oriented Architecture
The codebase uses a service layer pattern in Convex:

**Frontend → Convex Services → Database**

Key services in `convex/services/`:
- `UserService` - User management and credit operations
- `StripeService` - Payment processing and webhook handling
- `ImageService` - File uploads and image management
- `HttpService` - Webhook processing (Clerk user sync)

### Authentication Flow
1. **Clerk** handles user authentication and provides JWT tokens
2. **Convex** validates JWTs via `convex/auth.config.ts`
3. **Middleware** (`src/middleware.ts`) protects routes
4. **Webhook sync** keeps Clerk users in sync with Convex database via `convex/http.ts`

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
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
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
- **Vitest** with jsdom environment for React components
- **convex-test** for backend function testing
- Test files: `**/*.test.{ts,tsx}` in src/, `**/*.test.ts` in convex/
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
- `services/` - Business logic layer
- `lib/` - Shared utilities and environment validation
- `_generated/` - Auto-generated Convex types (do not edit)
- Root files: API endpoints and cron jobs

## Important Notes

- **Convex development**: Always run `npx convex dev` when working on backend functions
- **Environment setup**: All required environment variables must be set for build to succeed
- **Rate limiting**: Be aware of 10 requests/minute limit when testing uploads
- **File deduplication**: Files are deduplicated by SHA256 hash to save storage costs
- **Real-time updates**: Convex provides automatic real-time updates to React components
- **TypeScript strict mode**: Both frontend and backend use strict TypeScript configuration