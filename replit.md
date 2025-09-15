# Replit Configuration

## Overview

This is a full-stack laundry booking application built with React/TypeScript on the frontend and Express.js on the backend. The application provides a mobile-first interface for customers to book laundry services and includes an admin dashboard for order management. The system uses Firebase for authentication, PostgreSQL with Drizzle ORM for data persistence, and Stripe for payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for development tooling
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and custom hooks for local state
- **Authentication**: Firebase Auth with Google Sign-In support
- **Mobile-First Design**: Responsive components with floating navigation optimized for mobile experience

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Firebase Admin SDK for token verification and user management
- **API Design**: RESTful endpoints with role-based access control
- **File Structure**: Monorepo structure with shared schema between client and server

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon with connection pooling
- **ORM**: Drizzle ORM with migrations support
- **Schema Design**: 
  - Users table with Firebase UID integration and role-based access
  - Services table for laundry service definitions with flexible pricing
  - Orders table with status tracking and payment integration
  - Notifications table for user communications
- **Database Config**: Environment-based configuration with automatic migrations

### Authentication and Authorization
- **Primary Auth**: Firebase Authentication with email/password and Google OAuth
- **Token Management**: Firebase ID tokens for API authentication
- **Role System**: Customer and admin roles with middleware-enforced access control
- **Session Handling**: Stateless JWT-based authentication
- **User Profile Sync**: Automatic user creation on first login with Firebase UID mapping

### Payment Processing
- **Payment Provider**: Stripe for secure payment processing
- **Supported Methods**: Credit cards, ACH, Apple Pay, Google Pay (via Stripe)
- **Webhook Integration**: Stripe webhooks for payment status updates
- **PCI Compliance**: Stripe Elements for secure payment collection

## External Dependencies

### Core Services
- **Firebase**: Authentication, user management, and admin SDK
- **Stripe**: Payment processing and webhook handling
- **Neon Database**: PostgreSQL hosting with serverless architecture
- **Vercel/Replit**: Deployment platform with environment variable management

### Development Tools
- **Vite**: Frontend build tool with HMR and TypeScript support
- **Drizzle Kit**: Database migrations and schema management
- **TanStack Query**: Server state management and caching
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible component library

### Third-Party Integrations
- **Google APIs**: OAuth authentication provider
- **Radix UI**: Accessible primitive components
- **Wouter**: Lightweight routing library
- **Class Variance Authority**: Type-safe component variants
- **React Hook Form**: Form state management with validation

### Development Dependencies
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind
- **Firebase Admin SDK**: Server-side Firebase operations