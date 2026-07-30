# React Starter

<!-- README-I18N:START -->

[English](./README.md) | **汉语**

<!-- README-I18N:END -->

一个 React Web 脚手架，包含可复用的管理端应用壳、较完整的 shadcn/ui 组件目录，以及与框架无关的互操作 Demo。无需修改应用代码，即可连接 `go-fiber-starter` 或 `rust-axum-starter`。

## 主要特性

- React 19.2 与严格 TypeScript 7
- Vite 8、Rolldown、Tailwind CSS 4、Oxlint 和 Oxfmt
- 使用当前 Radix primitives 的 shadcn/ui 组件源码
- React Router 7、Zustand 5、Alova 3、React Hook Form 与 Zod 4
- 行为与真实后端一致的 Mock 模式
- 保留现有控制台和组件演示路由
- 新增健康检查、注册、登录、Bearer Token 和用户资料互操作页面
- Vitest 与 Testing Library
- 可在运行时选择后端的 Nginx 生产镜像

## 快速开始

```bash
mise install
mise exec -- pnpm install
mise exec -- pnpm dev
```

访问 `http://localhost:5173`，在侧边栏选择“互操作 Demo”。开发环境默认使用契约兼容的 Mock。

要使用真实后端：

```dotenv
VITE_USE_MOCK=false
VITE_PROXY_HOST=http://127.0.0.1:25610
```

如果 API 位于另一个源且不使用 Vite proxy，可把 `VITE_API_BASE_URL` 设置为后端源地址。Alova 客户端会统一追加 `/api`。

## 共同 API

互操作页面会实际调用：

| 方法   | 路径                 | 认证       |
| ------ | -------------------- | ---------- |
| `GET`  | `/api/health`        | 否         |
| `POST` | `/api/auth/register` | 否         |
| `POST` | `/api/auth/login`    | 否         |
| `GET`  | `/api/auth/profile`  | Bearer JWT |

跨技术栈的精确规则见 [`CONTRACT.md`](CONTRACT.md)。

## 常用命令

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm format:check
pnpm test:run
pnpm preview
```

## 项目结构

```text
src/
├── components/
│   ├── layout/             # 应用壳和导航
│   ├── magicui/            # 可选的聚焦视觉组件
│   └── ui/                 # shadcn/ui 组件源码
├── lib/api/                # Alova 客户端、方法、Mock 和共同类型
├── pages/
│   ├── components/         # 组件目录
│   └── interoperability-demo.tsx
├── store/                  # Zustand Store
└── test/                   # Vitest 初始化
```

## Docker

```bash
docker build -t react-starter .
docker run --rm -p 8080:80 -e BACKEND_URL=http://host.docker.internal:25610 react-starter
```

Nginx 模板会把 `/api` 代理到 `BACKEND_URL`，因此同一个前端镜像可以在运行时搭配任一后端。

## 依赖策略

依赖以 2026-07-29 可用的最新兼容稳定版为目标。shadcn registry 组件已刷新，以兼容 React DayPicker 10。Recharts 暂时固定为 registry 兼容的 `2.15.4`：升级到稳定版 `3.10.1` 会破坏当前 shadcn 图表组件的公开 TypeScript 契约，应在 registry 完成迁移后重新评估。Vite 当前为稳定版 8.1.5，不再是仓库原文所述的 beta。
