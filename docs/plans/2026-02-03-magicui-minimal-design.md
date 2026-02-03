# Magic UI 最小接入设计（Shimmer Button）

## 目标
- 以最小侵入方式接入 Magic UI，新增一个可演示的 Shimmer Button。
- 保持与现有 shadcn 演示结构一致，便于扩展和回滚。
- 只新增必要依赖，不改动全局样式。

## 范围
- 新增组件：`src/components/magicui/shimmer-button.tsx`
- 新增演示页：`src/pages/components/magicui-demo.tsx`
- 新增路由：`/components/magicui`
- 新增侧边栏入口：“Magic UI”
- 新增依赖：`framer-motion`

不在本次范围：
- 批量引入其他 Magic UI 组件
- 全局主题或 Tailwind 配置改动
- 业务逻辑与 API 集成

## 架构与实现方式
- Shimmer Button 使用 `framer-motion` 的 `motion.button` 实现 shimmer 动画。
- 组件仅使用 Tailwind 类名，借助 `cn` 组合类名以保持风格一致。
- Demo 页采用简单居中布局（与现有组件示例页面一致），展示 1~2 个状态。
- 保持组件与 demo 的隔离，便于后续扩展更多 Magic UI 组件。

## 数据流与状态
- 组件仅接收 `children`、`className` 和标准 `button` props（含 `disabled`）。
- 不引入外部状态或数据请求。
- `disabled` 时降低或停止动画强度，保持可访问性。

## 可访问性
- 保持原生 `button` 语义。
- 支持键盘聚焦样式。
- 支持 `prefers-reduced-motion`（使用 `useReducedMotion` 减弱动画）。

## 测试与验证
- 若启用测试：用 Vitest + React Testing Library 做最小渲染测试（含 `disabled`）。
- 运行 `pnpm dev` 进行目视检查；必要时运行 `pnpm build`。

## 风险与回滚
- 风险主要来自新增依赖（`framer-motion`）和动画样式兼容性。
- 回滚：删除 `magicui` 组件与 demo 页面、移除路由/侧边栏项、卸载依赖。

## 后续扩展
- 后续 Magic UI 组件统一放在 `src/components/magicui/*`。
- 可按需添加更多 demo 页面，保持与现有路由分组一致。
