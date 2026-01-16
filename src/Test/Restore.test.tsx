import { screen } from "@testing-library/react";
import App from "../App";
import { renderWithStore } from "../components/test-utlis";
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid-123"),
}));

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

