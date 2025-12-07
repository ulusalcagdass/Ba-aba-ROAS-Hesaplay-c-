# ROAS Hesaplayıcı (ROAS Calculator)

## Overview

This is a Turkish-language ROAS (Return on Ad Spend) calculator application designed for performance marketing professionals. The application is a utility-first tool that allows users to input product costs and fixed fees, then automatically calculates break-even ROAS targets based on different profit margin scenarios.

The app features real-time calculations, Turkish localization (including currency formatting with ₺ symbol), and a clean Material Design-inspired interface optimized for financial calculations and data clarity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: React hooks (useState, useMemo) for local state; TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens following Material Design principles

**Design System**:
- Typography: Inter/Roboto font family
- Color scheme: Neutral base with customizable theme support (light/dark mode infrastructure)
- Spacing: Tailwind standardized units (2, 4, 6, 8, 12, 16)
- Component library: Pre-built accessible components (cards, inputs, buttons, dialogs, etc.)

**Key Architectural Decisions**:
- Single-page application with minimal routing (home page + 404)
- Real-time calculation updates using useMemo for performance optimization
- Turkish locale formatting for numbers and currency throughout
- Responsive layout with mobile-first approach (grid-cols-1 md:grid-cols-2)

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js
- **Server Structure**: Minimal REST API setup with route registration pattern
- **Build Process**: ESBuild for production bundling with selective dependency bundling to improve cold start performance
- **Development**: tsx for TypeScript execution in development mode with Vite HMR integration

**Storage Layer**:
- **Interface**: IStorage abstraction pattern allowing swappable storage implementations
- **Current Implementation**: In-memory storage (MemStorage) with basic user CRUD operations
- **Prepared for**: PostgreSQL integration via Drizzle ORM (configuration present but not actively used)

**Key Architectural Decisions**:
- Separation of concerns: routes, storage interface, and static file serving isolated into separate modules
- Middleware-based architecture for logging, JSON parsing, and request handling
- Development/production environment separation with different startup flows
- Vite middleware integration in development for hot module replacement

### Data Storage

**ORM**: Drizzle ORM configured for PostgreSQL
- Schema definition in TypeScript with type inference
- Zod integration for runtime validation via drizzle-zod
- Migration support via drizzle-kit

**Current Schema**:
- Users table with UUID primary keys, username/password authentication structure
- Schema prepared but minimal usage in current application (calculator is client-side only)

**Key Decisions**:
- Type-safe database queries through Drizzle's TypeScript-first approach
- Schema-driven validation using Zod schemas derived from Drizzle tables
- Abstraction layer (IStorage interface) allowing easy switching between in-memory and database storage

### External Dependencies

**UI Component Libraries**:
- Radix UI: Unstyled, accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- Shadcn/ui: Pre-styled components built on Radix UI with Tailwind CSS
- Embla Carousel: Carousel/slider functionality
- cmdk: Command menu component
- Lucide React: Icon library

**Styling & Design**:
- Tailwind CSS: Utility-first CSS framework
- class-variance-authority: Component variant styling
- clsx/tailwind-merge: Conditional className utilities

**Form Management**:
- React Hook Form: Form state and validation (via @hookform/resolvers)
- Zod: Schema validation library

**Data Fetching**:
- TanStack Query (React Query): Server state management with caching

**Backend Infrastructure**:
- Express: Web server framework
- Drizzle ORM: Database ORM and query builder
- connect-pg-simple: PostgreSQL session store for Express

**Development Tools**:
- Vite: Build tool and dev server
- Replit plugins: Development banner, error overlay, cartographer for enhanced Replit integration
- TSX: TypeScript execution for development

**Date Handling**:
- date-fns: Date manipulation and formatting

**Session Management**:
- express-session: Session middleware (configured but minimal usage)
- connect-pg-simple: PostgreSQL-backed session storage

**Key Integration Points**:
- No external APIs currently integrated (calculator operates client-side)
- Database connection configured via DATABASE_URL environment variable
- Session storage can use either memory or PostgreSQL depending on configuration
- All third-party services are local dependencies with no external service calls