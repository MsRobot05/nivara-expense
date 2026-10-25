# Nivara | Expense Voucher Management System

<p align="center">
  <strong>A web-based approach to expense voucher management.</strong>
  <br />
  Built with React, Vite, and Supabase.
  <br /><br />
  <a href="https://nivara-expense.vercel.app/"><strong>View Live Demo</strong></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/MsRobot05/nivara-expense"><strong>Explore Source Code</strong></a>
</p>

---

## Project Overview

**Nivara** is an expense voucher management application developed as part of a Full Stack Developer Internship assignment. The project focuses on providing a web interface for expense-related information and a foundation for organizing voucher submission, review, and tracking workflows.

The application combines a React-based frontend with Supabase services and is deployed on Vercel.

### Project at a Glance

| Category | Details |
|---|---|
| Project | Nivara — Expense Voucher Management System |
| Frontend | React |
| Build Tool | Vite |
| Backend Services | Supabase |
| Frontend Hosting | Vercel |
| Live Application | [nivara-expense.vercel.app](https://nivara-expense.vercel.app/) |
| Source Code | [GitHub Repository](https://github.com/MsRobot05/nivara-expense) |

## Contents

- [Overview](#overview)
- [Key Capabilities](#key-capabilities)
- [Application Screenshots](#application-screenshots)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
- [Demo and Evaluation](#demo-and-evaluation)
- [Verification Checklist](#verification-checklist)
- [Security](#security)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

## Overview

Expense voucher processes involve recording expense details, maintaining supporting information, and tracking the progress of submissions and reviews. Nivara explores how these activities can be organized within a web application.

The project demonstrates the integration of a modern frontend, backend services, authentication, and a deployed web interface.

The deployed application has been tested for login and dashboard access. The availability of individual voucher operations and role-specific permissions depends on the implemented functionality.

## Key Capabilities

### Application Access
- Login interface for accessing the application.
- Dashboard displayed after successful login in the tested environment.

### Expense Voucher Management
The project is designed around expense voucher management. The available creation, editing, submission, and tracking operations should be evaluated against the current implementation.

### Review Workflow
The project scope includes expense review and tracking. Approval, rejection, status transitions, and role-specific permissions should be considered available only where implemented and verified.

## Application Screenshots

<img width="1892" height="922" alt="image" src="https://github.com/user-attachments/assets/8543ff55-65e7-4fac-9d7e-39f469b21935" />


### 01 — Login

<img width="1891" height="898" alt="image" src="https://github.com/user-attachments/assets/2c04bde8-a846-4c97-8a87-3f8e72c38cd4" />


### 02 — Dashboard

<img width="1896" height="702" alt="image" src="https://github.com/user-attachments/assets/0fba4cc2-e163-4c78-93e3-3a89252751fa" />


*The dashboard displayed after login.*

### 03 — Voucher Management

<img width="911" height="861" alt="image" src="https://github.com/user-attachments/assets/e7c8a258-30a2-4031-9dea-8016b1420edf" />




### 04 — Review Workflow

<img width="976" height="612" alt="image" src="https://github.com/user-attachments/assets/7d701100-d5ad-4ac7-ae7f-48a695f52bea" />
<img width="1035" height="511" alt="image" src="https://github.com/user-attachments/assets/2e9779b5-ad77-45e4-85ff-6cc2af48780e" />



## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tooling |
| Supabase | Backend services and application data integration |
| Vercel | Frontend deployment and hosting |

## Architecture

At a high level, the application connects the frontend to Supabase services.

```text
┌──────────────────────────────┐
│            User              │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       React Frontend         │
│       Built with Vite        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Supabase Services      │
│ Authentication and Data      │
└──────────────────────────────┘

Frontend hosting: Vercel
```

This diagram illustrates the high-level integration, not a complete deployment or security diagram. Any separate server-side component should be documented according to its actual configuration.

## Project Structure

The repository includes a frontend application and a server directory.

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

*The structure above is a high-level guide. Consult the repository for the complete and current file layout.*

## Local Setup

### Prerequisites

Before starting, ensure that you have:

- [Node.js](https://nodejs.org/) and npm installed.
- [Git](https://git-scm.com/) installed.
- Access to the source repository.
- A Supabase project configured for the application.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/MsRobot05/nivara-expense.git
cd nivara-expense
```

### Step 2 — Install Dependencies

```bash
cd client
npm install
```

### Step 3 — Configure Environment Variables

Create a `.env` file inside the `client/` directory:

```env
VITE_SUPABASE_URL=https://nmzbqlpcktdqogqrvdls.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_OvbIy3LGNCCDhiAPc4kMvw_LXl2Vi4j

Replace the placeholders with the corresponding values from your Supabase project settings.

Do not commit the `.env` file or publish private credentials.

### Step 4 — Configure Supabase

Configure the authentication and database resources required by the application.

The database schema, access policies, and any required user profiles must match the current source code. If the application depends on additional server-side configuration, configure that separately before running the corresponding features.

## Environment Configuration

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | URL of the Supabase project |
| `VITE_SUPABASE_ANON_KEY` | Public client key used to initialize Supabase from the frontend |

Additional server environment variables, if required, should be documented separately.

**Security note:** Variables prefixed with `VITE_` are included in client-side code. Never put a Supabase service-role key, database password, or other privileged secret in a frontend environment variable.

## Running the Project

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

If the server component is required, install its dependencies and use the scripts defined in `server/package.json`. The server's startup command and environment requirements should follow the actual implementation.

## Demo and Evaluation

**Live Demo:** [https://nivara-expense.vercel.app/](https://nivara-expense.vercel.app/)

**Source Code:** [https://github.com/MsRobot05/nivara-expense](https://github.com/MsRobot05/nivara-expense)

The deployed login and dashboard have been tested in the current environment.

For evaluation, use a dedicated test account with synthetic data if authentication is required. Share credentials privately where appropriate; do not publish passwords or privileged keys in this repository.

## Verification Checklist

The following checks are recommended when reviewing the application.

| Area | Verification |
|---|---|
| Application access | Login and dashboard access |
| Authentication | Invalid credentials and session behavior |
| Navigation | Page refresh and navigation between available screens |
| Voucher operations | Creation, editing, and persistence, where implemented |
| Review workflow | Submission and review status transitions, where implemented |
| Authorization | Access restrictions for implemented roles |
| Error handling | Behavior when a request fails or data is unavailable |
| Deployment | Live frontend loads and connects to the intended services |

This checklist describes suggested verification steps, not a claim that every item has passed.

## Security

Security is important for any application that handles expense-related information.

- Keep environment files and private credentials out of version control.
- Never expose privileged backend keys in frontend code.
- Configure appropriate database access policies for protected information.
- Enforce sensitive permissions using trusted backend logic or database policies where required.
- Use synthetic data for demonstrations.
- Review repository files and hosting environment variables before submission.

## Deployment

The frontend is deployed on Vercel.

| Resource | Link |
|---|---|
| Live Application | [Open Nivara](https://nivara-expense.vercel.app/) |
| Source Repository | [View on GitHub](https://github.com/MsRobot05/nivara-expense) |

The deployed frontend uses environment variables configured in the hosting environment. Backend deployment and server configuration depend on the application's actual setup.

## Future Enhancements

Potential areas for further development include:

- Expanded voucher creation and tracking workflows.
- Clearer workflow status history.
- More comprehensive role-based authorization.
- Improved form validation and error feedback.
- Search and filtering for voucher records.
- Automated tests for core application workflows.
- Additional accessibility and responsive design improvements.

These are potential enhancements rather than claims about current functionality.

## Author

**Shrestha Sengupta**

[GitHub Profile](https://github.com/MsRobot05)

---

<p align="center">
  <strong>Nivara — Expense Voucher Management System</strong>
  <br />
  <sub>Full Stack Developer Internship Project</sub>
</p>
