import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { renderWithStore } from "../components/test-utlis";
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid-123"),
}));
test("shows error when username or password is empty", async () => {
  renderWithStore(<App />, {
    route: "/login",
    preloadedState: {
      auth: {
        users: null,
        restoring: false,
        loading: false,
        error: "",
      },
    },
  });


  
  await userEvent.click(
    screen.getByRole("button", { name: /login/i })
  );

  
  expect(
    await screen.findByText(/username or password not exists/i)
  ).toBeInTheDocument();
});

test("successful login stores session and shows dashboard", async () => {
    sessionStorage.clear();

  //mock authorisation API
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({
      id: 1,
      username: "emilys",
      token: "token-123",
      refreshToken: "refresh-123",
    }),
  } as any);
  renderWithStore(<App />, { route: "/login" });

  await userEvent.type(
    screen.getByPlaceholderText(/username/i),
    "emilys"
  );
  await userEvent.type(
    screen.getByPlaceholderText(/password/i),
    "emilyspass"
  );

  await userEvent.click(
    screen.getByRole("button", { name: /login/i })
  );

  expect(
    await screen.findByText(/welcome emilys/i)
  ).toBeInTheDocument();

  //Verify that user stored in session item
  const stored = JSON.parse(
    sessionStorage.getItem("session_user")!
  );

  expect(stored.username).toBe("emilys");
  expect(stored.expiresAt).toBeGreaterThan(Date.now());
});


test("invalid login shows error message", async () => {
   sessionStorage.clear();

  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: false,
  } as any);
  renderWithStore(<App />, { route: "/login" });

  await userEvent.type(
    screen.getByPlaceholderText(/username/i),
    "wrong"
  );
  await userEvent.type(
    screen.getByPlaceholderText(/password/i),
    "wrong"
  );

  await userEvent.click(
    screen.getByRole("button", { name: /login/i })
  );

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent(/invalid username or password/i);
});


test("logout clears user and redirects to login", async () => {
 sessionStorage.setItem(
    "session_user",
    JSON.stringify({
      username: "Nishit",
      expiresAt: Date.now() + 100000,
    })
  );
   renderWithStore(<App />, {
    route: "/dashboard",
    preloadedState: {
      auth: {
        users: { username: "Nishit" },
        restoring: false,
        loading: false,
        error: "",
      },
    },
  });

  
  const logoutBtn = await screen.findByRole("button", {
    name: /logout/i,
  });

  await userEvent.click(logoutBtn);

 
  expect(
    await screen.findAllByText(/login/i)
  ).toHaveLength(2);

 
});
