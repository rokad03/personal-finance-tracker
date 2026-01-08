import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../components/Login";
import { useAppSelector } from "../components/hooks";
import { loginError, logout } from "../components/slice/loginSlice";
import Navbar from "../components/Navbar";
import { MemoryRouter, replace } from "react-router-dom";
import App from "../App";
import { store } from "../components/store/store";
import { Provider } from "react-redux";
import Dashboard from "../components/Pages/Dashboard";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../components/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid-123"),
}));

const mockSelector = useAppSelector as unknown as jest.Mock;

describe("Login Page", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login UI", () => {
    mockSelector.mockReturnValue({
      users: null,
      error: null
    });

    render(<Login />);

    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name:/login/i })).toBeInTheDocument();
   
  });
    test("shows error when clicking login with empty fields", async () => {
    mockSelector.mockReturnValue({ users: null, error: null });
    const user = userEvent.setup();
    
    render(<Login />);
    const pass=screen.getByPlaceholderText("Password")
    const username=screen.getByPlaceholderText("username")
    await user.type(pass, "123");
      await user.type(username, "john");
      await user.clear(username)
    await user.clear(pass);
  await user.click(screen.getByRole("button", { name: /login/i }));
   

    
    expect(mockDispatch).toHaveBeenCalledWith(
      loginError("username or password not exists")
    );
  });


  test("dispatches loginRequest when user submits", async () => {
    mockSelector.mockReturnValue({
      users: null,
      error: null
    });

    const user = userEvent.setup();

    render(<Login />);

    await user.type(screen.getByPlaceholderText("username"), "john");
    await user.type(screen.getByPlaceholderText("Password"), "123");
    await user.click(screen.getByRole("button", { name:/login/i }));

    expect(mockDispatch).toHaveBeenCalled();
  });

  test("redirects when user exists", () => {
    mockSelector.mockReturnValue({
      users: { name:"john" },
      error: null
    });

    render(<Login />);

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace:true });
  });

  test("shows redux error", () => {
    mockSelector.mockReturnValue({
      users: null,
      error: "Invalid credentials"
    });

    render(<Login />);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

 test("Test the logout function", async () => {
  const user = userEvent.setup();
  
  sessionStorage.setItem("session_user", JSON.stringify({ name: "john" }));


  mockSelector.mockImplementation((selectorFn) => {
    const mockState = {
      login: {
        users: { name: "john" },
        error: null,
      },
      transaction: {
        list: [],          
        recursiveList: [], 
        totalItems: { Income: 0, Expense: 0, top3Income: [], top3Expense: [] },
      },
    };
    return selectorFn(mockState);
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    </Provider>
  );

  
  const logoutBtn = await screen.findByRole("button", { name: /logout/i });
  await user.click(logoutBtn);


  expect(mockDispatch).toHaveBeenCalled();
  expect(mockDispatch).toHaveBeenCalledWith(logout());
});
});
