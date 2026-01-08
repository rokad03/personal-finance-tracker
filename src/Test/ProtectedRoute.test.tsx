import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../components/ProtectedRoute";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useAppSelector } from "../components/hooks";

jest.mock("../components/hooks", () => ({
  useAppSelector: jest.fn(),
}));

const mockSelector = useAppSelector as unknown as jest.Mock;

describe("ProtectedRoute", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows Loading... when restoring is true", () => {
    mockSelector.mockReturnValue({
      users: null,
      restoring: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Private Page</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("redirects to /login when user is missing", () => {
    mockSelector.mockReturnValue({
      users: null,
      restoring: false,
    });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Private Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("renders children when user exists", () => {
    mockSelector.mockReturnValue({
      users: { name: "john" },
      restoring: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Private Page</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Private Page")).toBeInTheDocument();
  });
});
