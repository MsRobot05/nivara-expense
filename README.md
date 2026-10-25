# Nivara — Expense Voucher Management System

<p align="center">
  <strong>A structured web application for expense voucher management.</strong>
  <br />
  Built with React, Vite and Supabase.
  <br /><br />
  <a href="https://nivara-expense.vercel.app/"><strong>🚀 View Live Demo</strong></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/MsRobot05/nivara-expense"><strong>💻 Source Code</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-Backend%20Services-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel" alt="Vercel" />
</p>

---

## Overview

**Nivara** is a web-based expense voucher management application designed to bring voucher-related activities into a centralized digital interface.

The project combines a React-based frontend with Supabase services to support the application's data and authentication needs. Its interface includes a login page, dashboard, voucher management area and review workflow.

The goal is to make expense-related workflows easier to access, navigate and manage through a web application.

## Explore the Application

| Resource | Link |
|---|---|
| 🌐 Live Application | [nivara-expense.vercel.app](https://nivara-expense.vercel.app/) |
| 📦 Source Code | [GitHub Repository](https://github.com/MsRobot05/nivara-expense) |

## Key Features

- **User Login** — An entry point for users to access the application.
- **Dashboard** — A central interface for navigating the application.
- **Voucher Management** — A dedicated interface for expense voucher operations.
- **Review Workflow** — An interface for voucher review-related activities.
- **Supabase Integration** — Backend services integrated with the application.
- **Web Deployment** — A hosted version accessible through the live demo.

*The exact available actions and permissions depend on the implemented application functionality.*

## Application Preview

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
| React | User interface |
| Vite | Development server and build tooling |
| Supabase | Backend services and database integration |
| JavaScript | Application logic |
| Vercel | Application deployment |

## Project Structure

The repository separates the client application from the server-side components.

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

*This is a high-level overview; additional files and directories may exist in the repository.*

## Getting Started

Follow the instructions below to prepare the client application for local development.

### Prerequisites

- Node.js
- npm
- A Supabase project with the required configuration

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
VITE_SUPABASE_URL=https://nmzbqlpcktdqogqrvdls.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_OvbIy3LGNCCDhiAPc4kMvw_LXl2Vi4j
```

Use the variable names expected by your application code. Do not commit private credentials or server-side secrets to the repository.

### 4. Start the Development Server

```bash
npm run dev
```

Open the local address printed in the terminal.

### 5. Create a Production Build

```bash
npm run build
```

### 6. Preview the Production Build

```bash
npm run preview
```

### Server Setup

The repository also contains a `server/` directory. Before running the server independently, inspect its `package.json` and configuration to confirm the required scripts, environment variables and dependencies.

## Architecture at a Glance

```text
User
  │
  ▼
React + Vite Client
  │
  ├── Login Interface
  ├── Dashboard
  ├── Voucher Management
  └── Review Workflow
  │
  ▼
Supabase Services
  │
  └── Configured Application Data
```

This diagram provides a conceptual overview. The exact request flow depends on how the client and server are connected in the implementation.

## Security Considerations

- Store environment-specific configuration in environment variables.
- Never expose Supabase service-role keys, passwords or private tokens in frontend code.
- Apply appropriate access controls to sensitive voucher data.
- Validate permissions on the server side for protected operations.
- Keep production credentials out of source control.

## Deployment

The project is available online through Vercel.

**Live application:** https://nivara-expense.vercel.app/

For a separate deployment, configure the appropriate project root, build command, environment variables and output directory according to the application configuration.

## Future Improvements

Potential areas for further development include:

- More detailed voucher status tracking
- Search and filtering for voucher records
- Clearer workflow status indicators
- Reporting and summary views
- Automated testing and validation
- Improved accessibility and responsive layouts

These are potential enhancements, not claims about existing functionality.

## Contributing

Suggestions and improvements are welcome. If you plan to contribute:

1. Fork the repository.
2. Create a branch for your changes.
3. Make and test your changes.
4. Submit a pull request describing the improvement.



---

<p align="center">
  <strong>Nivara — Bringing structure to expense voucher workflows.</strong>
  <br />
  Built with React, Vite and Supabase.
</p>
