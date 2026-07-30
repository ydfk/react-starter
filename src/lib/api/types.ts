export type HealthResponse = {
  status: "ok";
  service: string;
  version: string;
};

export type Credentials = {
  username: string;
  password: string;
};

export type UserResponse = {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export type TokenResponse = {
  token: string;
};

export type Problem = {
  status: number;
  title: string;
  detail: string;
  errors?: Array<{
    message: string;
    location?: string;
    value?: unknown;
  }>;
};
