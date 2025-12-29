import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../components/Pages/Dashboard";
import transactionReducer from "../components/slice/transactionSlice";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));


const rootReducer = combineReducers({
  transaction: transactionReducer,
});

type RootState = ReturnType<typeof rootReducer>;


const renderWithProviders = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
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
    renderWithProviders({ transaction: { totalItems: {Income:0,Expense:0,top5:[]} } as any });
    expect(mockedNavigate).toHaveBeenCalledWith("/login", { replace: true });
    expect(screen.getByText(/User session expires/i)).toBeInTheDocument();
  });

  test("Initial Test after session exists", () => {
   
    const mockUser = { username: "Nishit" };
    sessionStorage.setItem("session_user", JSON.stringify(mockUser));

    // Arrange: Mock Redux state
    const state = {
      transaction: {
        totalItems: {
          Income: 5000,
          Expense: 2000,
          top5: [
            { category: "Food", amount: 500 },
            { category: "Rent", amount: 1500 }
          ]
        }
      }
    };

    renderWithProviders(state as any);

    
    expect(screen.getByText(/Welcome Nishit/i)).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument(); // Income
    expect(screen.getByText("2000")).toBeInTheDocument(); // Expense
    expect(screen.getByText("3000")).toBeInTheDocument(); // Balance (5000-2000)

    
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  test("When top5 is missing", () => {
    sessionStorage.setItem("session_user", JSON.stringify({ username: "Aditya" }));
    
    renderWithProviders({
      transaction: {
        totalItems: { Income: 0, Expense: 0 } 
      } as any
    });

    expect(screen.getByText(/No Stats found/i)).toBeInTheDocument();
  });
});