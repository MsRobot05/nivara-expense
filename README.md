# Nivara | Expense Voucher Management System

**A web-based approach to expense voucher management.**

Built with React, Vite, and Supabase.

<p align="center">
  <a href="https://nivara-expense.vercel.app/"><strong>Live Demo</strong></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/MsRobot05/nivara-expense"><strong>Source Code</strong></a>
</p>

---

## Overview

Nivara is an expense voucher management application developed as part of a Full Stack Developer Internship assignment. It provides a web interface for working with expense-related information and explores the organization of voucher submission, review, and tracking workflows.

The frontend is deployed on Vercel and integrates with Supabase services. Login and dashboard access have been tested in the deployed application.

## Project at a Glance

| Category | Details |
|---|---|
| Project | Nivara — Expense Voucher Management System |
| Frontend | React |
| Build Tool | Vite |
| Backend Services | Supabase |
| Frontend Hosting | Vercel |
| Live Demo | [Open Nivara](https://nivara-expense.vercel.app/) |
| Source Code | [GitHub Repository](https://github.com/MsRobot05/nivara-expense) |

## Contents

- [Key Capabilities](#key-capabilities)
- [Application Screenshots](#application-screenshots)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Demo and Evaluation](#demo-and-evaluation)
- [Testing Checklist](#testing-checklist)
- [Security](#security)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

## Key Capabilities

### Application Access
- Login interface.
- Dashboard access after successful login in the tested environment.

### Expense Voucher Management
The application is focused on organizing expense-related information. Voucher creation, editing, submission, and tracking should be described as available features only where they are implemented in the current version.

### Review Workflow
The project scope includes expense review and tracking. Approval, rejection, workflow status changes, and role-specific permissions should be verified against the current implementation.

## Application Screenshots

Add genuine screenshots captured from your application. Save them in `docs/screenshots/` at the repository root, using the filenames below.

### Login Page

![Nivara login page](docs/screenshots/login.png)

### Dashboard

![Nivara dashboard](docs/screenshots/dashboard.png)

### Voucher Management

![Nivara voucher management](docs/screenshots/vouchers.png)

### Review Workflow

![Nivara review workflow](docs/screenshots/review-workflow.png)

*Include only screenshots of screens that exist in the current application. Use synthetic data and remove personal or sensitive information before publishing.*

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tooling |
| Supabase | Backend services and application data integration |
| Vercel | Frontend hosting and deployment |

## Architecture

At a high level, the frontend connects to Supabase services.

```text
                User
                  |
                  v
        +--------------------+
        |   React Frontend   |
        |   Built with Vite  |
        +--------------------+
                  |
                  v
        +--------------------+
        | Supabase Services  |
        | Auth and Data      |
        +--------------------+

        Frontend hosted on Vercel
```

This diagram represents the high-level frontend integration. Any separate server component should be documented according to its actual responsibilities and deployment configuration.

## Project Structure

The repository includes a frontend directory and a server directory.

```text
nivara-expense/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Login.jsx
│   │   ├── supabase.js
│   │   └── voucherService.js
│   ├── package.json
│   └── ...
├── server/
│   ├── server.js
│   ├── roleMiddleware.js
│   ├── supabase.js
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- Git
- A Supabase project configured for the application

### 1. Clone the repository

```bash
git clone https://github.com/MsRobot05/nivara-expense.git
cd nivara-expense
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `client/` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

Replace the placeholders with the appropriate values from your Supabase project settings. Do not commit your `.env` file.

### 4. Configure Supabase

Configure the authentication and database resources required by the application. Database tables, access policies, and user profiles should match the actual source code.

If the application requires a separately running server, configure its environment variables and dependencies as well.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | URL of the Supabase project |
| `VITE_SUPABASE_ANON_KEY` | Public client key used by the frontend |

Document additional server-side variables if required by the current implementation.

**Security note:** Variables prefixed with `VITE_` are exposed to client-side code. Never place a service-role key, database password, or other privileged secret in frontend environment variables.

## Running the Application

From the `client/` directory, start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal. Vite commonly uses `http://localhost:5173`.

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

If the server component is required, install its dependencies and use the scripts defined in `server/package.json`.

## Demo and Evaluation

**Live Demo:** [https://nivara-expense.vercel.app/](https://nivara-expense.vercel.app/)

**Source Code:** [https://github.com/MsRobot05/nivara-expense](https://github.com/MsRobot05/nivara-expense)

Login and dashboard access have been tested in the deployed application.

If the reviewer requires authentication, provide a dedicated test account with synthetic data. Share credentials privately rather than publishing passwords in the repository.

## Testing Checklist

Use this checklist to evaluate the application before submission.

- [ ] Login works with valid credentials.
- [ ] Invalid credentials are handled appropriately.
- [ ] The dashboard loads after login.
- [ ] Refresh and session behavior work correctly.
- [ ] Implemented voucher operations behave as expected.
- [ ] Changes persist after refresh where applicable.
- [ ] Implemented review and status transitions work correctly.
- [ ] Access restrictions are enforced for applicable roles.
- [ ] Errors and unavailable data are handled gracefully.

These are recommended checks, not claims that every test has passed.

## Security

- Keep `.env` files and private credentials out of version control.
- Never expose privileged backend keys in frontend code.
- Configure suitable database access policies for protected data.
- Enforce sensitive permissions through trusted server-side logic or database policies where required.
- Use synthetic data for demonstrations.
- Review tracked files and deployment environment variables before submission.

## Deployment

The frontend is deployed on Vercel.

| Resource | Link |
|---|---|
| Live Application | [Open Nivara](https://nivara-expense.vercel.app/) |
| Source Repository | [View on GitHub](https://github.com/MsRobot05/nivara-expense) |

The frontend uses environment variables configured in the hosting environment. Any separate backend deployment requirements depend on the application's actual configuration.

## Future Enhancements

Potential areas for future development include:

- Expanded voucher creation and tracking workflows.
- Voucher status history and audit tracking.
- More comprehensive role-based authorization.
- Improved form validation and error feedback.
- Search and filtering for voucher records.
- Automated tests for core workflows.
- Additional accessibility and responsive design improvements.

## Author

**Shrestha Sengupta**

[GitHub Profile](https://github.com/MsRobot05)

---

* Nivara — Expense Voucher Management System*  
*Full Stack Developer Internship Project*
