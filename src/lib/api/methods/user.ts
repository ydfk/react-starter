import { alovaInstance } from "..";
import type { Credentials, HealthResponse, TokenResponse, UserResponse } from "../types";

export const getHealth = () => alovaInstance.Get<HealthResponse>("/health");

export const register = (credentials: Credentials) =>
  alovaInstance.Post<UserResponse>("/auth/register", credentials);

export const login = (credentials: Credentials) =>
  alovaInstance.Post<TokenResponse>("/auth/login", credentials, {
    meta: {
      authRole: "login",
    },
  });

export const getProfile = () => alovaInstance.Get<UserResponse>("/auth/profile");
