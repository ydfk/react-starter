# Magic UI Minimal Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a minimal Magic UI demo (Shimmer Button) with a dedicated page, route, and sidebar entry.

**Architecture:** Create a standalone `ShimmerButton` component using `framer-motion`, render it in a new demo page, then wire the route and sidebar entry. Keep styles local to the component and avoid global CSS changes.

**Tech Stack:** React 19, Vite 8, Tailwind v4, framer-motion, React Router, shadcn/ui.

---

### Task 1: Add test tooling (Vitest + Testing Library)

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`

**Step 1: Add dev dependencies**

Run:
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: dependencies added to `package.json`.

**Step 2: Add test scripts**

Update `package.json` scripts:
```json
"test": "vitest",
"test:run": "vitest run"
```

**Step 3: Add test setup file**

Create `src/test/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

**Step 4: Configure Vite test settings**

Update `vite.config.ts` to include:
```ts
test: {
  environment: "jsdom",
  setupFiles: ["src/test/setup.ts"],
},
```

**Step 5: Sanity check**

Run:
```bash
pnpm test -- --run
```

Expected: no tests found (exit code 0).

---

### Task 2: Shimmer Button component (TDD)

**Files:**
- Create: `src/components/magicui/shimmer-button.tsx`
- Create: `src/components/magicui/shimmer-button.test.tsx`

**Step 1: Write failing test**

Create `src/components/magicui/shimmer-button.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { ShimmerButton } from "./shimmer-button";

test("renders button text", () => {
  render(<ShimmerButton>Get Started</ShimmerButton>);
  expect(screen.getByRole("button", { name: "Get Started" })).toBeInTheDocument();
});

test("respects disabled state", () => {
  render(<ShimmerButton disabled>Disabled</ShimmerButton>);
  expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
pnpm test -- shimmer-button
```

Expected: FAIL (module not found for `./shimmer-button`).

**Step 3: Create minimal component skeleton**

Create `src/components/magicui/shimmer-button.tsx`:
```tsx
import * as React from "react";

export function ShimmerButton({ children }: React.PropsWithChildren) {
  return <button>{children}</button>;
}
```

**Step 4: Run test to verify it fails on assertion**

Run:
```bash
pnpm test -- shimmer-button
```

Expected: FAIL (missing disabled handling).

**Step 5: Implement minimal behavior + styles**

Replace component with:
```tsx
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ShimmerButtonProps = React.ComponentPropsWithoutRef<"button">;

export function ShimmerButton({ className, children, disabled, ...props }: ShimmerButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-md border border-border bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      disabled={disabled}
      {...props}
      initial={false}
      animate={
        reduceMotion || disabled
          ? {}
          : { backgroundPosition: ["0% 50%", "100% 50%"] }
      }
      transition={
        reduceMotion || disabled
          ? undefined
          : { duration: 2, ease: "linear", repeat: Infinity }
      }
      style={
        reduceMotion || disabled
          ? undefined
          : {
              backgroundImage:
                "linear-gradient(120deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.35) 20%, rgba(255,255,255,0.15) 40%)",
              backgroundSize: "200% 100%",
            }
      }
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
```

**Step 6: Run test to verify it passes**

Run:
```bash
pnpm test -- shimmer-button
```

Expected: PASS.

---

### Task 3: Magic UI demo page (TDD)

**Files:**
- Create: `src/pages/components/magicui-demo.tsx`
- Create: `src/pages/components/magicui-demo.test.tsx`

**Step 1: Write failing test**

Create `src/pages/components/magicui-demo.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import MagicUiDemo from "./magicui-demo";

test("renders Magic UI demo heading", () => {
  render(<MagicUiDemo />);
  expect(screen.getByText("Magic UI")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
pnpm test -- magicui-demo
```

Expected: FAIL (module not found for `./magicui-demo`).

**Step 3: Create minimal component**

Create `src/pages/components/magicui-demo.tsx`:
```tsx
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function MagicUiDemo() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg rounded-md border p-6">
        <h1 className="text-lg font-semibold">Magic UI</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <ShimmerButton>Get Started</ShimmerButton>
          <ShimmerButton className="text-xs px-3 py-1">Small</ShimmerButton>
        </div>
      </div>
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run:
```bash
pnpm test -- magicui-demo
```

Expected: PASS.

---

### Task 4: Add route and sidebar entry (TDD)

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/components/layout/app-sidebar.tsx`
- Create: `src/components/layout/app-sidebar.test.tsx`

**Step 1: Write failing test for sidebar entry**

Create `src/components/layout/app-sidebar.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppSidebar } from "./app-sidebar";

test("shows Magic UI entry", () => {
  render(
    <MemoryRouter>
      <AppSidebar />
    </MemoryRouter>
  );

  expect(screen.getByText("Magic UI")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
pnpm test -- app-sidebar
```

Expected: FAIL (Magic UI entry missing).

**Step 3: Add sidebar entry**

Update `src/components/layout/app-sidebar.tsx` components list:
```ts
{
  title: "Magic UI",
  url: "/components/magicui",
},
```

**Step 4: Run test to verify it passes**

Run:
```bash
pnpm test -- app-sidebar
```

Expected: PASS.

**Step 5: Add route**

Update `src/main.tsx` routes array:
```tsx
{
  path: "components/magicui",
  element: <MagicUiDemo />,
},
```

**Step 6: Manual verification**

Run:
```bash
pnpm dev
```

Visit: `http://localhost:5173/components/magicui` and verify the shimmer button renders.
