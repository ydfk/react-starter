import { defineMock } from "@alova/mock";

const now = "2026-07-29T08:00:00Z";
const mockUser = {
  id: "019fc04f-3bb0-7c26-a9b2-c91cfc102042",
  username: "admin",
  createdAt: now,
  updatedAt: now,
};

export default defineMock({
  "[GET]/health": {
    status: "ok",
    service: "mock-backend",
    version: "1.0.0",
  },
  "[POST]/auth/register": ({ data }) => ({
    status: 201,
    statusText: "Created",
    body: {
      ...mockUser,
      username: data?.username ?? mockUser.username,
    },
  }),
  "[POST]/auth/login": { token: "mock-jwt-token" },
  "[GET]/auth/profile": mockUser,
});
