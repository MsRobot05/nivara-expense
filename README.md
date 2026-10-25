# Nivara — Expense Voucher Management System

<p align="center">
  <strong>A Web-Based Expense Voucher Management Application</strong>
  <br />
  Streamlining expense voucher creation, review, and approval workflows.
  <br /><br />
  <a href="https://nivara-expense.vercel.app/"><strong>Live Demo</strong></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/MsRobot05/nivara-expense"><strong>GitHub Repository</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-Backend%20Services-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel" alt="Vercel" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Application Screenshots](#application-screenshots)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Authentication and Authorization](#authentication-and-authorization)
- [Database Schema](#database-schema)
- [Business Rules and Validation](#business-rules-and-validation)
- [Security Considerations](#security-considerations)
- [Assumptions and Limitations](#assumptions-and-limitations)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)

## Overview

**Nivara** is a web-based Expense Voucher Management System designed to centralize expense voucher activities.

The application uses React and Vite for its frontend, integrates with Supabase, and is deployed on Vercel. Its interface includes a login page, dashboard, voucher management area, and review workflow.

The project was developed in the context of a Full Stack Developer Internship assignment focused on digitizing expense voucher processes and improving the accessibility of voucher information.

| Resource | Link |
|---|---|
| Live Application | [nivara-expense.vercel.app](https://nivara-expense.vercel.app/) |
| Source Code | [GitHub Repository](https://github.com/MsRobot05/nivara-expense) |

## Problem Statement

Manual expense voucher processes can involve paperwork, approval delays, and limited visibility into reimbursement status.

The internship assignment defines three application roles:

- **Employee:** Creates and tracks expense vouchers.
- **Director:** Reviews, approves, or rejects submitted vouchers.
- **Accounts Team:** Monitors vouchers for reimbursement processing.

The implemented functionality and permissions should be evaluated against these requirements and documented accurately.

## Key Features

The current interface includes the following areas:

- **Login Interface** — Entry point for application users.
- **Dashboard** — Central interface for accessing application information.
- **Voucher Management** — Interface for expense voucher operations.
- **Review Workflow** — Interface for voucher review-related activities.
- **Supabase Integration** — Backend services and database integration.
- **Web Deployment** — A deployed version accessible through the live demo.

Detailed permissions, workflow transitions, and validation behavior should be confirmed against the implementation.

## Application Screenshots

## Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/3c264d26-6e58-42ec-9d0e-dc80036ac3bc)

### Voucher Management
![Voucher Management](https://github.com/user-attachments/assets/4abc8155-b4cd-483f-953f-84b27d615652)

### Additional Screens
![Screen 3](https://github.com/user-attachments/assets/386464bf-0992-4df4-91c6-7b5ceaff9263)

![Screen 4](https://github.com/user-attachments/assets/5b69cfec-7987-46fc-b557-e6073a18c0b2)

![Screen 5](https://github.com/user-attachments/assets/b0a592c3-1541-4ae9-bf45-a4b710229982)

![Screen 7](https://github.com/user-attachments/assets/89592905-de16-4c48-b403-e583d495edbe)

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Development server and build tooling |
| JavaScript | Application logic |
| Supabase | Authentication and database services |
| Node.js | Backend JavaScript runtime |
| Express.js | HTTP API framework |
| Vercel | Application deployment |

## Project Architecture

The project separates the client application from server-side components and Supabase services.

```text
                 User
                   |
                   v
           React + Vite Client
              /          \
             v            v
      Express Server    Supabase
             |          Auth / DB
             |
             v
       Protected API Routes
```

This is a conceptual diagram based on the supplied client and server code. The client may also communicate directly with Supabase for operations implemented through its Supabase client.

## Project Structure

The supplied project structure includes the following files:

```text
nivara-expense/
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
├── server/
│   ├── server.js
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── supabase.js
│   └── package.json
└── README.md
```

This is a high-level representation; other files and directories may exist.

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- A Supabase project configured for the application

### 1. Clone the Repository

```bash
git clone https://github.com/MsRobot05/nivara-expense.git
cd nivara-expense
```

### 2. Install Client Dependencies

```bash
cd client
npm install
```

### 3. Configure Client Environment Variables

Create a `.env` file inside the `client/` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Use the values from your Supabase project. The variable names must match those referenced by the client source code.

### 4. Start the Client

From the `client/` directory:

```bash
npm run dev
```

Open the local URL printed in the terminal.

### 5. Build the Client

```bash
npm run build
```

### 6. Preview the Production Build

```bash
npm run preview
```

### 7. Start the Backend

Open a separate terminal from the repository root:

```bash
cd server
npm install
npm run dev
```

For a normal server start without the development watcher:

```bash
npm start
```

The Express server defaults to port `5000`, unless the `PORT` environment variable is configured.

## Environment Variables

### Client

Create `client/.env.example` with placeholders only:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Server

The supplied server code references these environment variables:

```env
PORT=5000
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

The authentication middleware also imports a backend Supabase client from `server/supabase.js`. Check that file for any additional required variables before completing the server environment configuration.

**Security:** Never commit `.env` files, passwords, access tokens, JWT secrets, or Supabase service-role keys. Variables prefixed with `VITE_` are included in the frontend build and must not contain server-side secrets.

## API Documentation

The backend uses Express.js and Supabase. The endpoints below are confirmed by the supplied `server.js` and middleware code.

### Base URL

- Local development: `http://localhost:5000`
- Production: Use the configured backend deployment URL.

### Available Endpoints

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `GET` | `/` | Not required by route | Returns the API welcome message and running status. |
| `GET` | `/api/health` | Not required by route | Returns the API health status. |
| `GET` | `/api/test-route` | Not required by route | Tests that routing works. |
| `GET` | `/api/me` | Required | Returns the authenticated user's ID and email. |
| `GET` | `/api/db-check` | Not required by route | Checks whether the backend can query the `vouchers` table. |
| `GET` | `/api/vouchers` | Required; employee, director, or accounts role | Retrieves vouchers using role-based query logic. |

### Example Responses

#### `GET /`

```json
{
  "message": "Welcome to the Nivara Expense Management API",
  "status": "running"
}
```

#### `GET /api/health`

```json
{
  "status": "healthy",
  "application": "Nivara"
}
```

#### `GET /api/test-route`

```json
{
  "message": "Test route works"
}
```

#### `GET /api/me`

Requires a valid Supabase access token.

```json
{
  "message": "Authentication successful",
  "user": {
    "id": "authenticated-user-id",
    "email": "user@example.com"
  }
}
```

The user values above are illustrative placeholders.

#### `GET /api/vouchers`

A successful response has this structure:

```json
{
  "vouchers": []
}
```

The empty array is an example. Actual results depend on database contents and access policies.

The route orders records by `created_at` in descending order. For employees, the query filters records by matching `employee_id` to the authenticated user's ID. Director and accounts users do not receive that additional employee-specific filter in this route.

### Authentication and Authorization

Nivara uses Supabase Auth to validate API access tokens. Protected routes require this HTTP header:

```http
Authorization: Bearer <supabase_access_token>
```

The `authenticateUser` middleware validates the token using Supabase Auth's `getUser()` method.

The `requireRole` middleware then looks up the user's role in `profiles.role`, matching `profiles.id` with the authenticated user's ID.

The voucher-list route permits these roles:

- `employee`
- `director`
- `accounts`

The role middleware creates a Supabase client that forwards the user's access token. Database permissions and Row Level Security (RLS) policies may impose additional restrictions.

### Error Responses

| HTTP status | Condition |
|---|---|
| `401 Unauthorized` | Missing or invalid authentication token, or authentication failure |
| `403 Forbidden` | Missing profile or role not allowed by the route |
| `500 Internal Server Error` | Role lookup or voucher query failure |

The API returns JSON error messages defined by the relevant middleware and route handlers.

### Database Connectivity Check

`GET /api/db-check` queries the `vouchers` table and returns a connected status when the query succeeds. It returns HTTP `500` if the query fails.

### Endpoint Scope

The supplied backend code does not establish separate Express routes for creating, updating, deleting, submitting, approving, or rejecting vouchers. If these operations are implemented through direct Supabase client calls, document those operations and the associated database policies after reviewing the relevant frontend and schema code.

## Database Schema

The supplied code confirms references to two Supabase tables.

| Table | Confirmed columns | Purpose |
|---|---|---|
| `profiles` | `id`, `role` | Retrieves the authenticated user's application role. |
| `vouchers` | `id`, `employee_id`, `created_at` | Supports the database check and voucher retrieval. |

This is not the complete database schema. Column data types, nullability, primary and foreign keys, constraints, indexes, additional fields, and RLS policies must be verified against the actual Supabase schema or SQL migrations.

The internship assignment can be used as a checklist when reviewing whether the database supports voucher numbers, employee information, department, expense details, amounts, statuses, signatures, approval dates, rejection reasons, and audit timestamps. Do not describe these as actual columns until verified.

## Business Rules and Validation

The internship assignment specifies the following requirements. Each should be checked against the implementation before being described as complete:

- Each voucher should have a unique voucher number.
- New vouchers should begin in Draft status.
- Department, expense title, expense date, and amount should be mandatory.
- The amount must be greater than zero.
- An employee signature should be required before submission.
- Employees should only edit or delete vouchers while they are drafts.
- Submitted vouchers should become read-only to employees.
- Only the Director should approve or reject eligible vouchers.
- Approval should require a Director signature.
- Rejection should require a reason.
- Employees should only access their own vouchers.
- Director and Accounts access should follow their assigned permissions.

Frontend validation improves usability, but sensitive rules should also be enforced by the backend or database where appropriate.

## Security Considerations

Expense voucher systems may handle personal, financial, and signature information. Security controls should be reviewed carefully.

The supplied backend code confirms token verification on protected routes, role lookup, and an employee-specific query filter on the voucher-list route.

Additional controls to verify include:

- Database-level authorization and appropriate RLS policies.
- Access restrictions for every voucher operation.
- Enforcement of valid voucher status transitions.
- Secure storage and access control for signatures.
- Safe management of environment variables and deployment secrets.
- Protection against unauthorized modification of user roles.

The `/api/db-check` and `/api/test-route` routes do not use authentication middleware in the supplied code.

## Assumptions and Limitations

The following details require further verification:

- **Account management:** How users are created and assigned roles.
- **Voucher numbering:** How unique voucher numbers are generated.
- **Signature storage:** Where signature images are stored and how access is controlled.
- **Workflow transitions:** Which status changes are allowed and whether rejected vouchers can be resubmitted.
- **Accounts processing:** Whether Accounts users can mark vouchers as paid or only view approved vouchers.
- **Search and filtering:** Which filters and sorting options are implemented.
- **Database security:** The actual RLS policies and database constraints.
- **Backend architecture:** Which operations use Express routes and which access Supabase directly.

Any functionality not implemented should be identified as a limitation or planned enhancement.

## Deployment

The application is deployed on Vercel.

**Live Demo:** [https://nivara-expense.vercel.app/](https://nivara-expense.vercel.app/)

For other deployments, configure the appropriate project root, build command, output settings, and environment variables according to the application configuration.

## Future Improvements

Potential enhancements include:

- Advanced voucher search and filtering.
- Role-specific dashboard analytics.
- Voucher printing and downloadable reports.
- Reimbursement payment-status tracking.
- Automated tests for validation and authorization.
- Audit logging for important voucher actions.
- Improved accessibility and responsive layouts.

These are potential enhancements, not claims about existing functionality.

## Contributing

Suggestions and improvements are welcome.

1. Fork the repository.
2. Create a branch for your changes.
3. Implement and test your changes.
4. Submit a pull request describing the improvement.

---

<p align="center">
  <strong>Nivara — Bringing structure to expense voucher workflows.</strong>
  <br />
  Built with React, Vite, Express.js, and Supabase.
</p>
