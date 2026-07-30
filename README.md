# React Starter

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=111827)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-source--owned-111827)](https://ui.shadcn.com/)

<!-- README-I18N:START -->

**English** | [汉语](./README.zh.md)

<!-- README-I18N:END -->

A modern React admin starter with Vite 8, shadcn/ui, Alova, contract-compatible mocks, and a backend interoperability demo.

> [!NOTE]
> React Starter can connect to either [Go Fiber Starter](https://github.com/ydfk/go-fiber-starter) or [Rust Axum Starter](https://github.com/ydfk/rust-axum-starter) through the same [`CONTRACT.md`](./CONTRACT.md).

## Overview

The project combines a reusable admin shell, a broad component catalogue, typed API methods, and a focused interoperability page. Mock and real transports expose the same Alova methods, which keeps UI code independent from the selected backend implementation.

## Highlights

- React 19 with strict TypeScript and React Router.
- Vite 8 with Rolldown, Tailwind CSS 4, Oxlint, and Oxfmt.
- Source-owned shadcn/ui and Radix UI components.
- Zustand state, React Hook Form, Zod validation, and Sonner feedback.
- Alova client with Bearer token injection and typed Problem errors.
- Contract-compatible mock mode for frontend-only development.
- Dashboard, user management, component catalogue, and interoperability routes.
- Vitest and Testing Library coverage.
- Nginx production image with a runtime-selectable backend.

## Tech stack

| Area            | Technology                                    |
| --------------- | --------------------------------------------- |
| UI              | React 19, shadcn/ui, Radix UI, Tailwind CSS 4 |
| Build           | Vite 8, TypeScript 7, pnpm 11                 |
| Data            | Alova 3, Zod 4                                |
| State and forms | Zustand 5, React Hook Form                    |
| Quality         | Oxlint, Oxfmt, Vitest, Testing Library        |

## Quick start

Install the pinned Node.js and pnpm versions, then start Vite:

```bash
mise install
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm dev
```

Open `http://127.0.0.1:20000`.

Development uses contract-compatible mocks by default, so a backend is not required for the first launch.

## Connect a real backend

Create an ignored `.env.development.local` file:

```dotenv
VITE_USE_MOCK=false
VITE_PROXY_HOST=http://127.0.0.1:21000
```

The example above connects to Go Fiber Starter. To use Rust Axum Starter instead, change only the target:

```dotenv
VITE_PROXY_HOST=http://127.0.0.1:31000
```

For a backend on another origin without the Vite proxy, set `VITE_API_BASE_URL` to the backend origin. The API module appends `/api` consistently.

## Demo routes

| Route               | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `/`                 | Admin dashboard and composed component overview        |
| `/user-management`  | Table, filtering, and user-management patterns         |
| `/interoperability` | Health, registration, login, and profile contract demo |
| `/components/*`     | Focused shadcn/ui and Magic UI examples                |

Use **Interoperability Demo** in the sidebar to confirm which backend is connected.

## Shared API contract

| Method | Path                 | Authentication |
| ------ | -------------------- | -------------- |
| `GET`  | `/api/health`        | No             |
| `POST` | `/api/auth/register` | No             |
| `POST` | `/api/auth/login`    | No             |
| `GET`  | `/api/auth/profile`  | Bearer JWT     |

The real and mock adapters use the same paths, status codes, response fields, and typed errors. See [`CONTRACT.md`](./CONTRACT.md) for the exact cross-stack rules.

## Environment variables

| Variable            | Default                  | Purpose                         |
| ------------------- | ------------------------ | ------------------------------- |
| `VITE_PORT`         | `20000`                  | Vite development port           |
| `VITE_APP_TITLE`    | `React Starter`          | Browser and application title   |
| `VITE_USE_MOCK`     | `true` in development    | Select mock or real API methods |
| `VITE_PROXY_HOST`   | `http://127.0.0.1:21000` | Development `/api` proxy target |
| `VITE_API_BASE_URL` | Empty                    | Optional direct backend origin  |

Keep personal overrides in `.env.development.local` so they are not committed.

## Commands

| Command             | Purpose                                |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Start the Vite development server      |
| `pnpm build`        | Type-check and build production assets |
| `pnpm preview`      | Preview the production build           |
| `pnpm lint`         | Run Oxlint                             |
| `pnpm format`       | Format project files with Oxfmt        |
| `pnpm format:check` | Check formatting without writing       |
| `pnpm test`         | Run Vitest in watch mode               |
| `pnpm test:run`     | Run the test suite once                |

Run the complete local verification set:

```bash
mise exec -- pnpm format:check
mise exec -- pnpm lint
mise exec -- pnpm test:run
mise exec -- pnpm build
```

## Docker

Build the Nginx image:

```bash
docker build -t react-starter:local .
```

Run it against the default Go backend:

```bash
docker run --rm -p 8080:80 \
  -e BACKEND_URL=http://host.docker.internal:21000 \
  react-starter:local
```

Set `BACKEND_URL=http://host.docker.internal:31000` to use Rust instead. The same frontend image proxies `/api` at runtime, so it does not need to be rebuilt when the backend changes.

> [!IMPORTANT]
> Docker Desktop is required for `host.docker.internal`. On Linux, use a reachable host address or an explicit Docker network.

## Project structure

```text
src/
├── components/
│   ├── layout/                 # Admin shell and navigation
│   ├── magicui/                # Focused visual components
│   └── ui/                     # Source-owned shadcn/ui components
├── lib/api/                    # Alova client, methods, mocks, types
├── pages/
│   ├── components/             # Component catalogue routes
│   └── interoperability-demo.tsx
├── store/                      # Zustand stores
└── test/                       # Shared Vitest setup
```

## Compatibility notes

- Vite uses stable `8.1.x` with the Rolldown build pipeline.
- Recharts remains pinned to `2.15.4` because the current shadcn chart source is not type-compatible with Recharts 3. Revisit the pin after the upstream registry migrates.
- The development port is `20000`; if Chromium reports `ERR_UNSAFE_PORT` after a custom change, switch `VITE_PORT` back to a browser-safe port.

## Troubleshooting

### The page starts but API requests fail

Confirm `VITE_USE_MOCK=false`, verify `VITE_PROXY_HOST`, and request the backend health endpoint directly.

```bash
curl http://127.0.0.1:21000/api/health
```

### Vite refuses to start on the configured port

This project enables `strictPort`, so Vite does not silently select another port. Stop the existing listener or choose another browser-safe value in `.env.development.local`.
