/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2025-03-11 10:49:14
 * @LastEditors: ydfk
 * @LastEditTime: 2025-03-11 11:00:10
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import Unauthorized from "./components/error/unauthorized";
import Layout from "./components/layout/layout";
import ButtonDemo from "./pages/components/button-demo";
import InputDemo from "./pages/components/input-demo";
import CardDemo from "./pages/components/card-demo";
import DialogDemo from "./pages/components/dialog-demo";
import FormDemo from "./pages/components/form-demo";
import TableDemo from "./pages/components/table-demo";
import DropdownMenuDemo from "./pages/components/dropdown-demo";
import SonnerDemo from "./pages/components/sonner-demo";
import SelectDemo from "./pages/components/select-demo";
import CalendarDemo from "./pages/components/calendar-demo";
import MagicUiDemo from "./pages/components/magicui-demo";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import UserManagement from "./pages/user-management";
import CheckboxDemo from "./pages/components/checkbox-demo";
import RadioGroupDemo from "./pages/components/radio-group-demo";
import SwitchDemo from "./pages/components/switch-demo";
import SliderDemo from "./pages/components/slider-demo";
import TabsDemo from "./pages/components/tabs-demo";
import ProgressDemo from "./pages/components/progress-demo";

// 创建路由
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "components/button",
        element: <ButtonDemo />,
      },
      {
        path: "components/input",
        element: <InputDemo />,
      },
      {
        path: "components/checkbox",
        element: <CheckboxDemo />,
      },
      {
        path: "components/radio-group",
        element: <RadioGroupDemo />,
      },
      {
        path: "components/switch",
        element: <SwitchDemo />,
      },
      {
        path: "components/slider",
        element: <SliderDemo />,
      },
      {
        path: "components/tabs",
        element: <TabsDemo />,
      },
      {
        path: "components/progress",
        element: <ProgressDemo />,
      },
      {
        path: "components/card",
        element: <CardDemo />,
      },
      {
        path: "components/dialog",
        element: <DialogDemo />,
      },
      {
        path: "components/form",
        element: <FormDemo />,
      },
      {
        path: "components/table",
        element: <TableDemo />,
      },
      {
        path: "components/dropdown",
        element: <DropdownMenuDemo />,
      },
      {
        path: "components/sonner",
        element: <SonnerDemo />,
      },
      {
        path: "components/select",
        element: <SelectDemo />,
      },
      {
        path: "components/calendar",
        element: <CalendarDemo />,
      },
      {
        path: "components/magicui",
        element: <MagicUiDemo />,
      },
    ],
  },
  {
    path: "/401",
    element: <Unauthorized />,
  },
  {
    path: "/auth/login",
    element: <App />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
);
