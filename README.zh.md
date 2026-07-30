# React Starter

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=111827)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-source--owned-111827)](https://ui.shadcn.com/)

<!-- README-I18N:START -->

[English](./README.md) | **汉语**

<!-- README-I18N:END -->

一个现代 React 管理端脚手架，集成 Vite 8、shadcn/ui、Alova、契约兼容 Mock 和后端互操作 Demo。

> [!NOTE]
> React Starter 可以通过同一份 [`CONTRACT.md`](./CONTRACT.md) 连接 [Go Fiber Starter](https://github.com/ydfk/go-fiber-starter) 或 [Rust Axum Starter](https://github.com/ydfk/rust-axum-starter)。

## 项目简介

项目组合了可复用的管理端外壳、完整组件目录、强类型 API 方法和专注于互操作验证的页面。Mock 与真实传输层暴露相同的 Alova 方法，使 UI 代码不依赖所选后端实现。

## 功能特性

- React 19、严格 TypeScript 和 React Router。
- Vite 8、Rolldown、Tailwind CSS 4、Oxlint 与 Oxfmt。
- 源码归属于项目的 shadcn/ui 与 Radix UI 组件。
- Zustand 状态、React Hook Form、Zod 校验与 Sonner 反馈。
- 支持 Bearer Token 注入和强类型 Problem 错误的 Alova 客户端。
- 用于纯前端开发的契约兼容 Mock 模式。
- 控制台、用户管理、组件目录和互操作路由。
- Vitest 与 Testing Library 测试。
- 可在运行时选择后端的 Nginx 生产镜像。

## 技术栈

| 领域       | 技术                                          |
| ---------- | --------------------------------------------- |
| UI         | React 19、shadcn/ui、Radix UI、Tailwind CSS 4 |
| 构建       | Vite 8、TypeScript 7、pnpm 11                 |
| 数据       | Alova 3、Zod 4                                |
| 状态与表单 | Zustand 5、React Hook Form                    |
| 质量       | Oxlint、Oxfmt、Vitest、Testing Library        |

## 快速开始

安装锁定的 Node.js 与 pnpm 版本，然后启动 Vite：

```bash
mise install
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm dev
```

访问 `http://127.0.0.1:20000`。

开发环境默认使用契约兼容 Mock，因此首次启动不需要后端。

## 连接真实后端

创建已忽略的 `.env.development.local`：

```dotenv
VITE_USE_MOCK=false
VITE_PROXY_HOST=http://127.0.0.1:21000
```

上面的示例连接 Go Fiber Starter。要使用 Rust Axum Starter，只需修改目标：

```dotenv
VITE_PROXY_HOST=http://127.0.0.1:31000
```

如果后端位于其他源且不使用 Vite 代理，请把 `VITE_API_BASE_URL` 设为后端源地址。API 模块会始终追加 `/api`。

## Demo 路由

| 路由                | 用途                                |
| ------------------- | ----------------------------------- |
| `/`                 | 管理控制台和组合组件总览            |
| `/user-management`  | 表格、筛选和用户管理模式            |
| `/interoperability` | 健康检查、注册、登录和资料契约 Demo |
| `/components/*`     | 独立的 shadcn/ui 与 Magic UI 示例   |

通过侧边栏的“互操作 Demo”确认当前连接的后端。

## 共同 API 契约

| 方法   | 路径                 | 认证       |
| ------ | -------------------- | ---------- |
| `GET`  | `/api/health`        | 否         |
| `POST` | `/api/auth/register` | 否         |
| `POST` | `/api/auth/login`    | 否         |
| `GET`  | `/api/auth/profile`  | Bearer JWT |

真实与 Mock 适配器使用相同路径、状态码、响应字段和强类型错误。精确的跨技术栈规则见 [`CONTRACT.md`](./CONTRACT.md)。

## 环境变量

| 变量                | 默认值                   | 用途                      |
| ------------------- | ------------------------ | ------------------------- |
| `VITE_PORT`         | `20000`                  | Vite 开发端口             |
| `VITE_APP_TITLE`    | `React Starter`          | 浏览器与应用标题          |
| `VITE_USE_MOCK`     | 开发环境为 `true`        | 选择 Mock 或真实 API 方法 |
| `VITE_PROXY_HOST`   | `http://127.0.0.1:21000` | 开发环境 `/api` 代理目标  |
| `VITE_API_BASE_URL` | 空                       | 可选的直接后端源地址      |

个人覆盖配置应放在 `.env.development.local`，避免提交到仓库。

## 常用命令

| 命令                | 用途                      |
| ------------------- | ------------------------- |
| `pnpm dev`          | 启动 Vite 开发服务器      |
| `pnpm build`        | 类型检查并构建生产资源    |
| `pnpm preview`      | 预览生产构建              |
| `pnpm lint`         | 运行 Oxlint               |
| `pnpm format`       | 使用 Oxfmt 格式化项目文件 |
| `pnpm format:check` | 只检查格式，不写入文件    |
| `pnpm test`         | 以监听模式运行 Vitest     |
| `pnpm test:run`     | 单次运行测试套件          |

运行完整本机检查：

```bash
mise exec -- pnpm format:check
mise exec -- pnpm lint
mise exec -- pnpm test:run
mise exec -- pnpm build
```

## Docker

构建 Nginx 镜像：

```bash
docker build -t react-starter:local .
```

连接默认 Go 后端运行：

```bash
docker run --rm -p 8080:80 \
  -e BACKEND_URL=http://host.docker.internal:21000 \
  react-starter:local
```

要使用 Rust，把配置改为 `BACKEND_URL=http://host.docker.internal:31000`。同一个前端镜像会在运行时代理 `/api`，更换后端不需要重新构建。

> [!IMPORTANT]
> `host.docker.internal` 需要 Docker Desktop。在 Linux 上请使用可访问的宿主机地址或显式 Docker 网络。

## 项目结构

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

## 兼容性说明

- Vite 使用稳定版 `8.1.x` 和 Rolldown 构建管线。
- Recharts 暂时固定为 `2.15.4`，因为当前 shadcn 图表源码与 Recharts 3 类型不兼容；上游 registry 完成迁移后应重新评估。
- 开发端口为 `20000`；如果自定义端口后 Chromium 报告 `ERR_UNSAFE_PORT`，请把 `VITE_PORT` 改回浏览器允许的端口。

## 常见问题

### 页面能够启动，但 API 请求失败

确认 `VITE_USE_MOCK=false`，检查 `VITE_PROXY_HOST`，并直接请求后端健康接口。

```bash
curl http://127.0.0.1:21000/api/health
```

### Vite 拒绝使用配置端口启动

项目启用了 `strictPort`，因此 Vite 不会静默选择其他端口。请停止已有监听进程，或在 `.env.development.local` 中选择另一个浏览器安全端口。
