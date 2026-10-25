# Nivara — Expense Voucher Management System

<p align="center">
  <strong>A Web-Based Expense Voucher Management Application</strong>
  <br />
  Streamlining expense voucher creation, review, and approval workflows.
  <br /><br />
  <a href="https://nivara-expense.vercel.app/"><strong>🚀 Live Demo</strong></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/MsRobot05/nivara-expense"><strong>📂 GitHub Repository</strong></a>
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
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Business Rules and Validation](#business-rules-and-validation)
- [Security Considerations](#security-considerations)
- [Assumptions and Limitations](#assumptions-and-limitations)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

## Overview

**Nivara** is a web-based Expense Voucher Management System built to provide a centralized interface for managing expense-related voucher activities.

The application uses React and Vite for the frontend, integrates with Supabase, and is deployed on Vercel. Its interface includes a login page, dashboard, voucher management area, and review workflow.

The project is developed in the context of a Full Stack Developer Internship assignment focused on digitizing expense voucher processes and improving the accessibility of voucher information.

| Resource | Link |
|---|---|
| Live Application | [nivara-expense.vercel.app](https://nivara-expense.vercel.app/) |
| Source Code | [GitHub Repository](https://github.com/MsRobot05/nivara-expense) |

## Problem Statement

Manual expense voucher processes can involve paperwork, approval delays, and limited visibility into reimbursement status.

The intended system workflow centralizes voucher-related activities in a web application. The assignment defines three roles:

- **Employee:** creates and tracks expense vouchers.
- **Director:** reviews, approves, or rejects submitted vouchers.
- **Accounts Team:** monitors vouchers for reimbursement processing.

The application's implemented capabilities should be evaluated against these requirements and documented accurately.

## Key Features

The current interface includes the following areas:

- **Login Interface** — Entry point for application users.
- **Dashboard** — Central interface for accessing application information.
- **Voucher Management** — Interface for expense voucher operations.
- **Review Workflow** — Interface for voucher review-related activities.
- **Supabase Integration** — Backend services integrated with the application.
- **Web Deployment** — A deployed version accessible through the live demo.

The exact permissions, workflow transitions, validation rules, and supported actions should be confirmed against the implementation.

## Application Screenshots

The following screenshots show the application's interface and key screens.

### Application Overview

<img width="1895" height="916" alt="image" src="https://github.com/user-attachments/assets/3c264d26-6e58-42ec-9d0e-dc80036ac3bc" />

### 01. Login

<img width="698" height="901" alt="image" src="https://github.com/user-attachments/assets/4abc8155-b4cd-483f-953f-84b27d615652" />

### 02. Dashboard

<img width="1632" height="717" alt="image" src="https://github.com/user-attachments/assets/386464bf-0992-4df4-91c6-7b5ceaff9263" />

### 03. Voucher Management

<img width="1876" height="892" alt="image" src="https://github.com/user-attachments/assets/5b69cfec-7987-46fc-b557-e6073a18c0b2" />

<img width="993" height="333" alt="image" src="https://github.com/user-attachments/assets/b0a592c3-1541-4ae9-bf45-a4b710229982" />

### 04. Review Workflow

<img width="1010" height="491" alt="image" src="https://github.com/user-attachments/assets/04ca8a88-6223-470f-8ff1-8c75543a1be2" />

<img width="1597" height="540" alt="image" src="https://github.com/user-attachments/assets/89592905-de16-4c48-b403-e583d495edbe" />

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Development server and build tooling |
| JavaScript | Application logic |
| Supabase | Backend services and data integration |
| Vercel | Application deployment |
| Node.js | Server-side runtime, where used |

## Project Architecture

The repository separates the client application from server-side components.

```text
                     User
                       |
                       v
              React + Vite Client
                       |
             +---------+---------+
             |                   |
             v                   v
      Server Components       Supabase
             |                   |
             +---------+---------+
                       |
                       v
                Application Data
```

This is a conceptual overview of the project's components. The exact request flow, authentication mechanism, and division of responsibilities should be confirmed from the source code.

## Project Structure

The repository includes client and server directories.

```text
nivara-expense/
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
├── server/
│   ├── server.js
│   ├── roleMiddleware.js
│   ├── supabase.js
│   └── package.json
└── README.md
```

This is a high-level representation; additional files and directories may exist.

## Getting Started

Follow these steps to set up the client application for local development.

### Prerequisites

- Node.js
- npm
- Git
- A Supabase project with the configuration required by the application

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

### 3. Configure Environment Variables

Create a `.env` file inside the `client/` directory.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Use the exact variable names expected by your source code. These names are examples based on the current configuration shown in this README; verify them against the client implementation.

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL printed in the terminal.

### 5. Create a Production Build

```bash
npm run build
```

### 6. Preview the Production Build

```bash
npm run preview
```

### Server Setup

The repository includes a `server/` directory. Review `server/package.json` to identify its scripts and dependencies before starting the server independently.

The server's required environment variables and startup commands should be documented after confirming them from the actual implementation.

## Environment Variables

Use environment variables to configure the application for local development and deployment.

Example client `.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Create the example file without real credentials and commit the example, not your private `.env` file.

If the server requires additional variables, document them in a separate server-side example file.

**Important:** Never commit passwords, private tokens, or Supabase service-role keys. Variables prefixed with `VITE_` are exposed to the frontend build and must not contain server-side secrets.

## Database Schema

The project uses Supabase, but the exact database tables, columns, relationships, and policies have not been established by this README alone.

For the internship submission, document the actual schema from your Supabase project or SQL migration files.

Include the following information for each existing table:

| Item | What to document |
|---|---|
| Table name | Actual database table name |
| Primary key | Actual primary-key column |
| Columns | Names, types, and nullability |
| Relationships | Actual foreign keys and references |
| Constraints | Unique constraints and validation rules |
| Access policies | Applicable Row Level Security (RLS) policies |

### Suggested Schema Documentation

The assignment describes voucher information such as voucher number, employee information, department, expense details, amount, status, signatures, approval date, rejection reason, and audit timestamps.

Use these requirements as a checklist when describing the actual database design. Do not assume that every field is stored in a particular table or that signatures are stored separately.

**Before submission:** add the real table definitions or link to your SQL migrations and explain how the tables relate to one another.

## API Documentation

The repository contains a server directory, but this README does not establish the exact REST endpoints implemented by the project.

Document each actual endpoint using the following format:

| Field | Description |
|---|---|
| Method and path | Actual HTTP method and route |
| Purpose | What the endpoint does |
| Authentication | Whether a valid session or token is required |
| Authorization | Which roles may call the endpoint |
| Request | Required parameters and request body |
| Response | Actual response structure |
| Errors | Relevant HTTP status codes and error messages |

### Endpoint Reference

Populate this table from the actual server routes. Do not treat the example operations as implemented endpoints.

| Operation | Endpoint |
|---|---|
| Retrieve vouchers | Add actual implemented route, if present |
| Retrieve voucher details | Add actual implemented route, if present |
| Create a voucher | Add actual implemented route, if present |
| Update a draft | Add actual implemented route, if present |
| Delete a draft | Add actual implemented route, if present |
| Submit a voucher | Add actual implemented route, if present |
| Approve or reject a voucher | Add actual implemented route, if present |

If the client accesses Supabase directly for some operations, document those data operations and the relevant database access policies instead of inventing REST endpoints.

## Business Rules and Validation

The internship assignment defines the following business requirements. Verify each one against the current implementation.

- Every voucher must have a unique voucher number.
- New vouchers should begin in Draft status.
- Department, expense title, expense date, and amount are mandatory.
- The amount must be greater than zero.
- An employee signature is required before submission.
- Employees may edit or delete vouchers only while they are drafts.
- Submitted vouchers become read-only to employees.
- Only the Director may approve or reject eligible vouchers.
- A Director signature is required for approval.
- Rejection requires a reason.
- Employees may access only their own vouchers.
- The Director and Accounts Team may access organization-wide voucher information, according to their permissions.

The frontend should provide useful validation feedback, while sensitive business rules should also be enforced by the backend or database.

## Security Considerations

Expense voucher systems may handle personal, financial, and signature information. Appropriate controls should protect this data.

Security measures to implement and verify include:

- Authentication for protected application areas.
- Role-based authorization for sensitive actions.
- Ownership checks for employee voucher access.
- Server-side or database-level enforcement of permissions.
- Validation of permitted voucher status transitions.
- Secure handling and access control for uploaded signatures.
- Appropriate Supabase Row Level Security policies.
- Secure management of environment variables and deployment secrets.

Hiding an interface element or protecting a frontend route alone does not enforce data access permissions.

## Assumptions and Limitations

The following details require confirmation from the implementation and should be documented accurately for evaluation:

- **Account management:** how users are created and how their roles are assigned.
- **Voucher numbering:** how unique voucher numbers are generated.
- **Signature storage:** where signature images are stored and how access is controlled.
- **Workflow transitions:** which status changes are allowed and whether rejected vouchers can be resubmitted.
- **Accounts processing:** whether Accounts users can mark vouchers as paid or only view approved vouchers.
- **Search and filtering:** which filters and sorting options are implemented.
- **Backend architecture:** which operations use server routes and which access Supabase directly.

Any functionality not implemented should be identified as a limitation or planned enhancement rather than described as complete.

## Deployment

The application is deployed on Vercel.

**Live Demo:** https://nivara-expense.vercel.app/

For another deployment, configure the correct project root, build command, output settings, and environment variables based on the actual application configuration.

## Future Improvements

Potential enhancements, depending on the current implementation, include:

- Advanced voucher search and filtering.
- Role-specific dashboard analytics.
- Voucher printing and downloadable reports.
- Reimbursement payment-status tracking.
- Automated tests for validation and authorization.
- Audit logging for important voucher actions.
- Improved accessibility and responsive layouts.

These are suggestions for future development, not claims about existing functionality.

## Contributing

Suggestions and improvements are welcome.

1. Fork the repository.
2. Create a branch for your changes.
3. Implement and test your changes.
4. Submit a pull request describing the improvement.

## License

Add a license file if you intend to specify how others may use, modify, or distribute this project.

---

<p align="center">
  <strong>Nivara — Bringing structure to expense voucher workflows.</strong>
  <br />
  Built with React, Vite and Supabase.
</p>
