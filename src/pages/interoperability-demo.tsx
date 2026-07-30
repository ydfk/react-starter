import { FormEvent, useCallback, useEffect, useState } from "react";
import { Activity, LogIn, LogOut, RefreshCw, Server, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiError, clearAccessToken, getAccessToken } from "@/lib/api";
import { getHealth, getProfile, login, register } from "@/lib/api/methods/user";
import type { Credentials, HealthResponse, UserResponse } from "@/lib/api/types";

const credentialsSchema = z.object({
  username: z.string().min(1, "请输入用户名").max(64, "用户名不能超过 64 个字符"),
  password: z.string().min(6, "密码至少需要 6 个字符").max(72, "密码不能超过 72 个字符"),
});

type AuthMode = "login" | "register";

function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.problem.detail;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "请求失败，请检查后端连接";
}

export default function InteroperabilityDemo() {
  const [health, setHealth] = useState<HealthResponse>();
  const [healthError, setHealthError] = useState<string>();
  const [healthLoading, setHealthLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [credentials, setCredentials] = useState<Credentials>({
    username: "admin",
    password: "change-me",
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string>();
  const [user, setUser] = useState<UserResponse>();

  const refreshHealth = useCallback(async () => {
    setHealthLoading(true);
    setHealthError(undefined);
    try {
      setHealth(await getHealth().send());
    } catch (error) {
      setHealth(undefined);
      setHealthError(errorMessage(error));
    } finally {
      setHealthLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      setUser(await getProfile().send());
    } catch (error) {
      setUser(undefined);
      setAuthError(errorMessage(error));
    }
  }, []);

  useEffect(() => {
    void refreshHealth();
    if (getAccessToken()) {
      void refreshProfile();
    }
  }, [refreshHealth, refreshProfile]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = credentialsSchema.safeParse(credentials);
    if (!parsed.success) {
      setAuthError(parsed.error.issues[0]?.message ?? "请输入有效凭据");
      return;
    }

    setAuthLoading(true);
    setAuthError(undefined);
    try {
      if (authMode === "register") {
        await register(parsed.data).send();
        setAuthMode("login");
        toast.success("注册成功，可以使用相同凭据登录");
      } else {
        await login(parsed.data).send();
        await refreshProfile();
        toast.success("登录成功");
      }
    } catch (error) {
      setAuthError(errorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    clearAccessToken();
    setUser(undefined);
    setAuthError(undefined);
    toast("已退出当前会话");
  }

  return (
    <div className="mx-auto flex min-w-0 w-full max-w-6xl flex-col gap-6">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Shared contract 1.0</Badge>
          <Badge variant={health ? "default" : "secondary"}>
            {health ? "后端已连接" : "等待后端"}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">前后端互操作 Demo</h1>
          <p className="max-w-3xl text-muted-foreground">
            这张控制面板只依赖共同 HTTP 契约。无需改动页面代码，即可在 Go Fiber 与 Rust axum
            后端之间切换。
          </p>
        </div>
      </section>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle>运行时连接</CardTitle>
                <CardDescription>读取共同的 `GET /api/health`。</CardDescription>
              </div>
              <Server className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg border bg-muted/30 p-4 font-mono text-sm">
              {healthLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner /> 正在检查后端
                </span>
              ) : health ? (
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                  <dt className="text-muted-foreground">status</dt>
                  <dd>{health.status}</dd>
                  <dt className="text-muted-foreground">service</dt>
                  <dd className="min-w-0 break-all">{health.service}</dd>
                  <dt className="text-muted-foreground">version</dt>
                  <dd>{health.version}</dd>
                </dl>
              ) : (
                <p className="text-muted-foreground">{healthError ?? "尚未获得后端状态"}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => void refreshHealth()} disabled={healthLoading}>
              {healthLoading ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <RefreshCw data-icon="inline-start" />
              )}
              重新检测
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>认证契约</CardTitle>
            <CardDescription>注册、登录和用户资料使用同一组类型与错误结构。</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                  <ShieldCheck className="mt-0.5 size-5 text-primary" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{user.username}</p>
                    <p className="break-all font-mono text-xs text-muted-foreground">{user.id}</p>
                  </div>
                  <Badge className="shrink-0">已认证</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => void refreshProfile()}>
                    <RefreshCw data-icon="inline-start" />
                    刷新资料
                  </Button>
                  <Button variant="ghost" onClick={logout}>
                    <LogOut data-icon="inline-start" />
                    退出
                  </Button>
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={submitAuth}>
                <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as AuthMode)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">登录</TabsTrigger>
                    <TabsTrigger value="register">注册</TabsTrigger>
                  </TabsList>
                </Tabs>
                <FieldGroup>
                  <Field data-invalid={Boolean(authError) || undefined}>
                    <FieldLabel htmlFor="username">用户名</FieldLabel>
                    <Input
                      id="username"
                      value={credentials.username}
                      onChange={(event) =>
                        setCredentials((current) => ({ ...current, username: event.target.value }))
                      }
                      aria-invalid={Boolean(authError) || undefined}
                      autoComplete="username"
                    />
                  </Field>
                  <Field data-invalid={Boolean(authError) || undefined}>
                    <FieldLabel htmlFor="password">密码</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={credentials.password}
                      onChange={(event) =>
                        setCredentials((current) => ({ ...current, password: event.target.value }))
                      }
                      aria-invalid={Boolean(authError) || undefined}
                      autoComplete={authMode === "login" ? "current-password" : "new-password"}
                    />
                  </Field>
                </FieldGroup>
                {authError ? <p className="text-sm text-destructive">{authError}</p> : null}
                <Button type="submit" disabled={authLoading}>
                  {authLoading ? (
                    <Spinner data-icon="inline-start" />
                  ) : authMode === "login" ? (
                    <LogIn data-icon="inline-start" />
                  ) : (
                    <UserPlus data-icon="inline-start" />
                  )}
                  {authMode === "login" ? "登录并读取资料" : "创建用户"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>兼容矩阵</CardTitle>
          <CardDescription>两个前端只依赖下列路径，因此可以连接任一后端。</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>能力</TableHead>
                <TableHead>共同路径</TableHead>
                <TableHead>Go Fiber</TableHead>
                <TableHead>Rust axum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["健康检查", "GET /api/health"],
                ["注册", "POST /api/auth/register"],
                ["登录", "POST /api/auth/login"],
                ["用户资料", "GET /api/auth/profile"],
              ].map(([capability, endpoint]) => (
                <TableRow key={endpoint}>
                  <TableCell className="font-medium">{capability}</TableCell>
                  <TableCell className="font-mono text-xs">{endpoint}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">兼容</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">兼容</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <Activity className="mr-2 size-4" aria-hidden="true" />
          Mock 模式也复用相同方法、路径、状态码和字段。
        </CardFooter>
      </Card>
    </div>
  );
}
