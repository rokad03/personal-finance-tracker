import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../components/Login";


const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../components/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (fn: any) =>
    fn({
      auth: {
        users: null,
        error: null,
      },
    }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Page", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockNavigate.mockClear();
  });

  test("renders login form", () => {
    render(<Login />);

   
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("dispatches loginError ", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: "username or password not exists",
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { username: "", password: "" },
      })
    );
  });

  test("dispatches loginRequest with filled values", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByPlaceholderText("username"), "john");
    await user.type(screen.getByPlaceholderText("Password"), "123");

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { username: "john", password: "123" },
      })
    );
  });

  test("navigates when users exists", () => {
    jest
      .spyOn(require("../components/hooks"), "useAppSelector")
      .mockImplementation((fn: any) =>
        fn({
          auth: { users: { name: "john" }, error: null },
        })
      );
   

    render(<Login />);

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  test("shows error text when Redux error exists", () => {
    jest
      .spyOn(require("../components/hooks"), "useAppSelector")
      .mockImplementation((fn: any) =>
        fn({
          auth: { users: null, error: "Invalid credentials" },
        })
      );

    render(<Login />);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });
});
