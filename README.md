# React Starter

<!-- README-I18N:START -->

**English** | [汉语](./README.zh.md)

<!-- README-I18N:END -->

A React web starter with a reusable admin shell, a broad shadcn/ui component catalogue, and a framework-neutral interoperability demo. It can connect to either `go-fiber-starter` or `rust-axum-starter` without changing application code.

## Features

- React 19.2 and strict TypeScript 7
- Vite 8 with Rolldown, Tailwind CSS 4, Oxlint, and Oxfmt
- shadcn/ui source components with current Radix primitives
- React Router 7, Zustand 5, Alova 3, React Hook Form, and Zod 4
- Contract-compatible real and mock API modes
- Existing dashboard and component demonstration routes
- New health, registration, login, Bearer token, and profile interoperability route
- Vitest and Testing Library
- Nginx production image with a runtime-selectable backend

## Quick start

```bash
mise install
mise exec -- pnpm install
mise exec -- pnpm dev
```

Open `http://localhost:5173` and select **Interoperability Demo** in the sidebar. Development uses contract-compatible mocks by default.

To use a real backend:

```dotenv
VITE_USE_MOCK=false
VITE_PROXY_HOST=http://127.0.0.1:25610
```

For an API on another origin without the Vite proxy, set `VITE_API_BASE_URL` to the backend origin. The Alova client appends `/api`.

## Shared API

The interoperability page exercises:

| Method | Path                 | Authentication |
| ------ | -------------------- | -------------- |
| `GET`  | `/api/health`        | No             |
| `POST` | `/api/auth/register` | No             |
| `POST` | `/api/auth/login`    | No             |
| `GET`  | `/api/auth/profile`  | Bearer JWT     |

See [`CONTRACT.md`](CONTRACT.md) for the exact cross-stack rules.

## Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm format:check
pnpm test:run
pnpm preview
```

## Project layout

```text
src/
├── components/
│   ├── layout/             # Application shell and navigation
│   ├── magicui/            # Optional focused visual components
│   └── ui/                 # shadcn/ui source components
├── lib/api/                # Alova client, methods, mocks, and shared types
├── pages/
│   ├── components/         # Component catalogue
│   └── interoperability-demo.tsx
├── store/                  # Zustand stores
└── test/                   # Vitest setup
```

## Docker

```bash
docker build -t react-starter .
docker run --rm -p 8080:80 -e BACKEND_URL=http://host.docker.internal:25610 react-starter
```

The Nginx template proxies `/api` to `BACKEND_URL`, so one frontend image can use either backend at runtime.

## Dependency policy

Dependencies target the latest compatible stable releases available on 2026-07-29. The shadcn registry sources were refreshed for React DayPicker 10. Recharts remains pinned to the registry-compatible `2.15.4`: upgrading to stable `3.10.1` breaks the current shadcn chart component's public TypeScript contract, so this pin should be revisited when the registry migrates. Vite is stable 8.1.5 rather than the earlier beta documented by this repository.
