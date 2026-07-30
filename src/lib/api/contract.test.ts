import { beforeEach, describe, expect, test } from "vitest";

import { clearAccessToken, getAccessToken } from ".";
import { getHealth, getProfile, login, register } from "./methods/user";

describe("shared API contract", () => {
  beforeEach(() => {
    clearAccessToken();
  });

  test("uses the same health shape as both real backends", async () => {
    await expect(getHealth().send()).resolves.toEqual({
      status: "ok",
      service: "mock-backend",
      version: "1.0.0",
    });
  });

  test("registers, stores the login token, and loads a profile", async () => {
    const user = await register({ username: "alice", password: "pass123" }).send();
    expect(user.username).toBe("alice");

    await login({ username: "alice", password: "pass123" }).send();
    expect(getAccessToken()).toBe("mock-jwt-token");

    await expect(getProfile().send()).resolves.toMatchObject({ username: "admin" });
  });
});
