import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../components/Pages/Dashboard";
import transactionReducer from "../components/slice/transactionSlice";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid-123"),
}));

const renderWithProviders = (preloadedState = {}) => {
  const store = configureStore({
    reducer: { transaction: transactionReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </Provider>
  );
};


describe("Dashboard Component", () => {

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });


  test("redirects to login if no user session exists", () => {
    renderWithProviders({
      transaction: {
        list: [],
        recursiveList:[],
        totalItems: { Income: 0, Expense: 0 },
      },
    });
    expect(mockedNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });


  test("renders initial dashboard UI", () => {
    sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "Nishit" })
    );

    renderWithProviders({
      transaction: {
        list: [],
        recursiveList:[],
        totalItems: { Income: 0, Expense: 0 },
      },
    });

    expect(screen.getByText("Total Income")).toBeInTheDocument();
    expect(screen.getByText("Total Expenses")).toBeInTheDocument();
    expect(screen.getByText("Current Balance")).toBeInTheDocument();
  });


  test("renders transaction data correctly", () => {
    sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "Nishit" })
    );

    renderWithProviders({
      transaction: {
        list: [],
        recursiveList:[],
        totalItems: {
          Income: 0,
          Expense: 200,
          top3Expense: [{ category: "Sports", amount: 200 }],
          top3Income: [],
        },
      },
    });

    expect(screen.getByText(/Sports/i)).toBeInTheDocument();
   expect(screen.getAllByText("200").length).toBeGreaterThan(0);
    expect(screen.getByText("-200")).toBeInTheDocument(); // balance
  });


  test("top expense category is displayed", () => {
    sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "Nishit" })
    );

    renderWithProviders({
      transaction: {
        list: [],
        recursiveList:[],
        totalItems: {
          Income: 200,
          Expense: 200,
          top3Expense: [{ category: "Sports", amount: 400 }],
          top3Income: [],
        },
      },
    });

    expect(screen.getByText("400")).toBeInTheDocument();
  });

});
