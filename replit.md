# replit.md

## Overview

This is a modern full-stack React application built with TypeScript that serves as a pharmaceutical pricing calculator (H8OrthoPrix). The application helps pharmacists calculate product pricing based on various factors like product type, VAT rates, discounts, and market prices. It features a sleek dark-themed UI built with React, shadcn/ui components, and Tailwind CSS, with a Node.js/Express backend and PostgreSQL database integration via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React 18 with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript support
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, local state for form data
- **Routing**: Wouter for client-side routing
- **Build System**: Vite for frontend, esbuild for backend

## Key Components

### Frontend Architecture
- **Component Structure**: Uses shadcn/ui components with custom styling
- **Form Management**: React Hook Form with Zod validation
- **State Management**: TanStack Query for API calls, local storage for calculation history
- **Theme System**: Dark/light theme support with custom CSS variables
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **API Structure**: RESTful endpoints under `/api` prefix
- **Middleware**: JSON parsing, URL encoding, request logging
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reloading with Vite integration

### Database Schema
The application uses a simplified user schema and calculation-focused data models:
- User management with basic authentication structure
- Calculation history storage with product details and pricing information
- Support for various product types (parapharmacie, homeopathie, contraceptive pills)

### Core Business Logic
- **Pricing Calculator**: Complex coefficient calculation based on product type, VAT rates, and special categories
- **Market Comparison**: Integration with external pricing sources (SantéStat)
- **History Management**: Local storage of calculation history with export capabilities
- **Product Categories**: Support for special product types with different pricing rules

## Data Flow

1. **User Input**: Form data captured in real-time with validation
2. **Auto-calculation**: Pricing calculations triggered on form changes
3. **Storage**: Results saved to local storage for history tracking
4. **Export**: Support for JSON and CSV export formats
5. **Market Integration**: External API calls for price comparison

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with TypeScript
- **Component Library**: Radix UI primitives via shadcn/ui
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form with Hookform Resolvers
- **Validation**: Zod for schema validation
- **State Management**: TanStack React Query
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Utilities**: clsx, class-variance-authority

### Backend Dependencies
- **Server Framework**: Express.js
- **Database**: Neon Database (PostgreSQL) via @neondatabase/serverless
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Validation**: Zod schemas shared between frontend and backend

### Development Tools
- **Build Tool**: Vite with React plugin
- **Type Checking**: TypeScript with strict configuration
- **Development**: tsx for TypeScript execution
- **Code Quality**: ESLint integration through Vite
- **Replit Integration**: Cartographer plugin and runtime error overlay

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with auto-restart on changes
- **Database**: Neon serverless PostgreSQL
- **Integration**: Vite middleware mode for seamless development

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: esbuild compilation to `dist/index.js`
- **Assets**: Static file serving via Express
- **Database**: Drizzle migrations via `db:push` command

### Environment Configuration
- **Database URL**: Required via `DATABASE_URL` environment variable
- **Session Management**: PostgreSQL-backed sessions for scalability
- **Static Files**: Served from compiled frontend build

The application is designed for easy deployment on platforms like Replit, with development tooling optimized for the Replit environment including custom plugins and error handling.

## Recent Changes

**2025-01-29:**
- Ajout d'un tableau de bord analytique complet avec visualisations avancées
- Intégration de graphiques Recharts pour les tendances de prix et volumes
- Métriques clés avec filtres par période et type de produit
- Bouton Analytics compact (icône seule) dans le header aligné avec le style existant
- Arrondi automatique au 0,05 centime près pour conformité réglementaire française

**2025-01-28:**
- Suppression complète des fonctionnalités d'import/export (CSV, JSON, PDF)
- Ajout d'un système de basculement thème clair/sombre avec ThemeToggle
- Amélioration du contraste en mode clair pour une meilleure lisibilité
- Simplification de l'interface utilisateur en gardant uniquement les fonctions essentielles
- Conservation uniquement de l'historique local avec options vider/supprimer