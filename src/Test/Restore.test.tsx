import { screen } from "@testing-library/react";
import App from "../App";
import { renderWithStore } from "../components/test-utlis";
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid-123"),
}));
test("restoreSession uses stored user if not expired", async () => {
  const futureUser = {
    username: "emilys",
    expiresAt: Date.now() + 100000,
  };

  sessionStorage.setItem(
    "session_user",
    JSON.stringify(futureUser)
  );

  renderWithStore(<App/>, { route: "/" });

  expect(
    await screen.findByText(/welcome emilys/i)
  ).toBeInTheDocument();
});
test("restoreSession refreshes token when expired", async () => {
  const expiredUser = {
    username: "emilys",
    expiresAt: Date.now() - 1000,
    refreshToken: "refresh123",
  };

  sessionStorage.setItem(
    "session_user",
    JSON.stringify(expiredUser)
  );

  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      authToken: "new-token",
      refreshToken: "new-refresh",
    }),
  } as any);

  renderWithStore(<App />, { route: "/" });

  expect(
    await screen.findByText(/welcome emilys/i)
  ).toBeInTheDocument();
});
test("restoreSession logs out if refresh fails", async () => {
  const expiredUser = {
    username: "emilys",
    expiresAt: Date.now() - 1000,
    refreshToken: "bad-token",
  };

  sessionStorage.setItem(
    "session_user",
    JSON.stringify(expiredUser)
  );

  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: false,
  } as any);

  renderWithStore(<App />, { route: "/" });

  expect(
    await screen.findByText(/session expired/i)
  ).toBeInTheDocument();
});
test("restoreSession handles corrupted session", async () => {
  sessionStorage.setItem("session_user", "INVALID_JSON");

  renderWithStore(<App />, { route: "/" });

  expect(
    await screen.findByText(/restore failed/i)
  ).toBeInTheDocument();
});
