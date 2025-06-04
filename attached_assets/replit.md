# Lumient E-commerce Application

## Overview

This repository contains a full-stack e-commerce application called "Lumient" that specializes in handcrafted candles. The application uses a modern tech stack including React, Express, and Drizzle ORM. The architecture follows a standard client-server pattern with a RESTful API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- Built with React using TypeScript
- Routing handled by Wouter (lightweight alternative to React Router)
- State management and data fetching with TanStack React Query
- UI components from Radix UI with custom styling via Tailwind CSS using the shadcn/ui component system
- Theme management with context API supporting light/dark modes

### Backend
- Express.js server with TypeScript
- RESTful API architecture for product and cart management
- Storage layer abstraction for database operations
- Authentication ready (though implementation details aren't complete)

### Database
- Drizzle ORM for database operations
- PostgreSQL is intended as the database (referenced in .replit modules)
- Schema designed for products and cart functionality

### Deployment
- Set up for Replit hosting
- Build process configured for production deployment

## Key Components

### Shared
- `schema.ts`: Contains database schema definitions using Drizzle ORM for products and cart items
- Zod schemas for data validation

### Server
- `index.ts`: Express server setup with middleware configuration
- `routes.ts`: API endpoint definitions for products and cart operations
- `storage.ts`: Data access layer that abstracts database operations
- `vite.ts`: Development server configuration

### Client
- `App.tsx`: Main application component with router setup
- `ThemeProvider.tsx`: Context provider for theme management
- UI components organized in a component-based architecture:
  - Page components (`Home.tsx`, `ProductPage.tsx`)
  - Feature components (`ProductGallery.tsx`, `ProductInfo.tsx`)
  - Layout components (`Header.tsx`, `Footer.tsx`)
  - UI library components (shadcn/ui)

## Data Flow

1. **Product Browsing**:
   - Client requests products from API
   - Server retrieves products from the database through the storage layer
   - Client renders products with TanStack Query handling caching and state

2. **Product Details**:
   - User navigates to a product page
   - Client fetches product details and related products from API
   - Server retrieves the specific product and related items
   - Client renders product details, options, and gallery

3. **Cart Management**:
   - User adds items to cart
   - Client sends cart updates to API
   - Server stores cart information in the database
   - Cart state is managed client-side with React Query

## External Dependencies

### Frontend
- **@radix-ui/***: UI component primitives
- **@tanstack/react-query**: Data fetching and state management
- **wouter**: Lightweight routing
- **class-variance-authority**: For managing component variants
- **tailwindcss**: CSS utility framework
- **shadcn/ui**: Component system built on Radix UI and Tailwind

### Backend
- **express**: Web server framework
- **drizzle-orm**: TypeScript ORM
- **zod**: Schema validation
- **@neondatabase/serverless**: Database connector (for Neon PostgreSQL)

## Deployment Strategy

The application is configured for deployment on Replit:

1. Development:
   - `npm run dev` runs both the Vite frontend dev server and Express backend
   - Hot module reloading enabled for rapid development

2. Production:
   - `npm run build` builds the frontend and bundles the backend
   - `npm run start` runs the production server
   - Static assets served by Express

The deployment configuration in `.replit` ensures:
- Node.js 20 and PostgreSQL 16 are available
- Port 5000 is mapped to external port 80
- The application autoscales based on demand

## Database Schema

The database has two main tables:

1. **products**:
   - Core product information (name, price, description)
   - Product variants and customization options
   - Image gallery references
   - Rating and review information

2. **cart_items**:
   - Links products to users
   - Tracks quantity and selected variants
   - Used for the shopping cart functionality

Additional tables for users, orders, and authentication would likely be added as the application develops further.