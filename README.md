# Gym Management Application Backend

A scalable and robust backend for efficient gym management. This backend project provides the core API and services for
managing members, memberships, payments, and check-ins, integrating seamlessly with
the [frontend application](https://github.com/HanifCarroll/gym-management-client).

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Architecture Overview](#architecture-overview)
4. [Getting Started](#getting-started)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Code Quality and Formatting](#code-quality-and-formatting)
10. [License](#license)
11. [Contact Information](#contact-information)

## Features

- Member management with CRUD operations
- Membership plan creation and management
- Payment processing with Stripe integration
- Member check-in system
- Well-documented RESTful API

## Technologies Used

- Node.js: JavaScript runtime for building the server-side application
- Nest.js: A progressive Node.js framework for building efficient, scalable applications
- TypeScript: Strongly typed programming language that builds on JavaScript
- Supabase: Hosted Postgres database for data storage
- Stripe: Payment processing integration for handling transactions
- Jest: Testing framework for unit and integration tests
- ESLint: Linting tool to ensure code quality
- Prettier: Code formatter for consistent styling
- Docker: Containerization for consistent environment setup

## Architecture Overview

This project is structured following the principles of modularity and separation of concerns. The backend is organized
into several key modules:

Core Modules:

- Members Module: Handles all operations related to gym members
- Membership Plans Module: Manages membership plans
- Payments Module: Integrates with Stripe to manage payments
- Check-In Module: Records and manages member check-ins

Services and Repositories:

- Service Layer: Contains business logic for each module
- Repository Layer: Handles data access and manipulation

Utility Layer:

- Supabase Service: Provides a wrapper around Supabase
- Stripe Service: Encapsulates Stripe API calls

This architecture promotes:

- Scalability: The modular structure allows for easy expansion and maintenance
- Testability: Separation of concerns ensures that each module can be tested independently
- Maintainability: Clear organization of code enhances readability and makes it easier to update or refactor

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm (v10 or later)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/HanifCarroll/gym-management-server.git
   ```

2. Navigate to the project directory:

   ```
   cd gym-management-server
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Environment Setup

1. Copy the `.env.example` file to `.env`:

   ```
   cp .env.example .env
   ```

2. Edit `.env` and set the required environment variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

Your stripe secret key can be retrieved from your Stripe dashboard.

Please make sure that test mode is enabled and that you grab the corresponding key. It should start with pk*test*.

## Running the Application

To run the application in development mode:

```
npm run start:dev
```

The server will start on `http://localhost:3001`, and the API will be accessible at this URL.

## Testing

This project uses Jest for unit and integration testing. Tests cover the core business logic, service layers, and API
endpoints to ensure reliability and correctness.

To run tests:

```
npm test
```

For watch mode:

```
npm run test:watch
```

Test coverage reports are generated automatically and can be reviewed to ensure that the application is well-tested.

## Database Schema

The database schema is implemented in Supabase and follows a relational model. Key entities include:

- Members: Stores member information such as name, contact details, and status
- MembershipPlans: Defines the available membership plans, including duration and pricing
- Memberships: Links members to their membership plans, with start and end dates
- Payments: Tracks payment transactions, including amounts and statuses
- CheckIns: Records member check-ins, linked to a member

## API Endpoints

The backend exposes a RESTful API for interacting with the system. Key endpoints include:

- Members:
  - GET /api/members
  - POST /api/members
  - PUT /api/members/:id
  - DELETE /api/members/:id
- Membership Plans:
  - GET /api/membership-plans
  - POST /api/membership-plans
  - PATCH /api/membership-plans/:id
  - DELETE /api/membership-plans/:id
- Payments:
  - POST /api/payments/initiate
  - POST /api/payments/confirm/:paymentIntentId
  - GET /api/payments/history
- Check-Ins:
  - POST /api/check-in
  - GET /api/check-in/history

These endpoints are documented using Swagger, which is automatically generated and can be accessed
at `http://localhost:3001/api`.

## Code Quality and Formatting

To ensure code quality and consistency, this project uses:

- **Prettier**: For consistent code formatting

  - Configuration in `.prettierrc`
  - Run formatter: `npm run format`

- **ESLint**: For static code analysis

  - Configuration in `.eslintrc.js`
  - Run linter: `npm run lint`

- **lint-staged**: For running linters on git staged files

  - Configuration in `package.json`

- **Husky**: For running git hooks
  - Pre-commit hook to run lint-staged

These tools ensure that the codebase remains clean, readable, and maintainable.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact Information

For any inquiries about this project, please contact:

Hanif Carroll

Email: [HanifCarroll@gmail.com](mailto:HanifCarroll@gmail.com)

LinkedIn: https://www.linkedin.com/in/hanifcarroll

GitHub: https://github.com/HanifCarroll
