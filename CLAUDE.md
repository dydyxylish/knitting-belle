# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Guidelines

This document defines the project's rules, objectives, and progress management methods. Please proceed with the project according to the following content.

## Top-Level Rules

- To maximize efficiency, **if you need to execute multiple independent processes, invoke those tools concurrently, not sequentially**.
- **You must think exclusively in English**. However, you are required to **respond in Japanese**.
- To understand how to use a library, **always use the Context7 MCP** to retrieve the latest information.

## Programming Rules

- Avoid hard-coding values unless absolutely necessary.
- Do not use `any` or `unknown` types in TypeScript.
- You must not use a TypeScript `class` unless it is absolutely necessary (e.g., extending the `Error` class for custom error handling that requires `instanceof` checks).

## Essential Commands

### Development
```bash
# Install dependencies
pnpm install

# Start development server with environment variables
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start

# Format and lint code
pnpm lint
```

### Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run CI tests (includes coverage)
pnpm test:ci

# Run specific test file
pnpm test __tests__/lib/serverAction/payment.test.ts

# Run E2E tests with Playwright
pnpm e2e

# Run Playwright tests with headed browser (for debugging)
pnpm e2e:headed

# Run Playwright tests with UI mode (for development)
pnpm e2e:ui

# Run Playwright tests in debug mode
pnpm e2e:debug
```

### AWS Amplify Backend
```bash
# Deploy Amplify backend (requires AWS CLI setup)
pnpm sandbox

# Delete sandbox environment
pnpm delete

# Seed data to backend
pnpm seed
```

## Code Architecture

### Tech Stack
- **Frontend**: Next.js 15.3.4 with React 19, TypeScript, Tailwind CSS
- **Backend**: AWS Amplify (Cognito, DynamoDB, S3, Lambda)
- **Payments**: Stripe integration
- **Testing**: Jest with jsdom environment, Playwright for E2E testing
- **Code Quality**: Biome for formatting/linting, Lefthook for git hooks

### Directory Structure

#### App Directory (`app/`)
- **`(pages)/`**: Next.js page routes with container/presentation pattern
  - Each page has `_containers/` and `_components/` directories
  - Containers handle data fetching and state (`container.tsx`, `index.tsx`, `presentation.tsx`)
- **`_components/`**: Shared UI components (Header, Footer, LoginDialog, etc.)
- **`_lib/`**: Core application logic
  - `serverAction/`: Server actions (payment processing)
  - `fetch/`: Data fetching functions organized by domain (knittingPattern, purchaseHistory, yarnCraftImage)
  - `create/` and `update/`: Data mutation functions
- **`api/`**: API routes (auth callbacks, Stripe webhooks)

#### Database Layer (`db/`)
- **`query/`**: Database query functions organized by domain
- **`repository/`**: Repository pattern implementations
- **`dataloader/`**: DataLoader implementations for efficient data fetching

#### Core Libraries (`lib/`)
- Environment validation (`env.ts`)
- Logging configuration (`logger.ts`)
- Authentication utilities (`isAuthenticated.ts`, `getUserInfo.ts`)
- Stripe configuration (`stripe.ts`)
- Schema definitions (`schema.ts`)

#### AWS Amplify (`amplify/`)
- **`auth/`**: Cognito configuration and branding
- **`data/`**: DynamoDB schema definitions
- **`storage/`**: S3 bucket configurations
- **`seed/`**: Database seeding scripts

### Authentication & Authorization
- Google OAuth via AWS Cognito
- Admin role with special permissions for content management
- Session-based authentication using cookies
- Protected routes check authentication status

### Payment Processing
- Stripe integration for purchasing knitting patterns
- Webhook handling for payment confirmations
- Purchase history tracking linked to user accounts
- Automatic file access granting upon successful payment

### Content Management
- Knitting patterns stored in S3 with signed URL access
- Craft images publicly accessible in S3
- Database stores metadata and relationships
- Admin users can upload and manage content

### Container/Presentation Pattern
Components follow a consistent pattern:
- `container.tsx`: Data fetching and business logic
- `presentation.tsx`: Pure UI components
- `index.tsx`: Public API exports

### Environment Configuration
- Environment variables stored in Project Root Directory
- Different configs for `.env.development`, `.env.test`
- Uses dotenvx for environment variable management
- AWS Amplify outputs in `amplify_outputs.json`

## Code Quality & Testing

### Linting & Formatting
- Biome handles both formatting and linting
- Automatic import sorting and unused import removal
- Tab indentation, double quotes for strings
- Pre-commit hooks run Biome checks automatically

### Test Structure
- Comprehensive test coverage (70% global, 85% for critical files)
- Test types: unit tests, integration tests, security tests, spec tests
- Heavy focus on payment processing and authentication security
- Mocks for AWS Amplify, Stripe, and Next.js functions
- 10-second timeout for async operations

### Git Workflow
- Lefthook manages pre-commit hooks
- Biome formatting runs on staged files
- Current branch: `feature/polish-design`
- Main branch: `main`

## Important Notes

- **Security**: Never commit secrets to repository - use environment variables
- **Dependencies**: Always check existing package.json before adding new dependencies
- **Patterns**: Follow existing container/presentation pattern for new components
- **Authentication**: Always validate user permissions for protected operations
- **Error Handling**: Use proper error boundaries and logging with Pino
- **Performance**: Utilize DataLoader pattern for efficient database queries