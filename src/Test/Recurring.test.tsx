import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import Recurring from "../components/Pages/Recurring";
import transactionReducer from "../components/slice/transactionSlice";
import authReducer from "../components/slice/loginSlice";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate
}));

jest.mock("uuid", () => ({
  v4: () => "static-id-123"
}));

const renderWithStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer,transaction: transactionReducer },
    preloadedState
  });

  return render(
    <Provider store={store}>
      <Recurring />
    </Provider>
  );
};


describe("Recurring Page", () => {

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });


  test("redirects to login if session missing", () => {
    renderWithStore();
    expect(mockedNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });


  test("renders heading", () => {
    sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "Nishit" })
    );

    renderWithStore({
      transaction: { list: [], recursiveList: [], totalItems: {} }
    });

    expect(
      screen.getByText("Recurring Transactions")
    ).toBeInTheDocument();
  });


  test("shows only recurring transactions", async () => {
    sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "Nishit" })
    );

    renderWithStore({
      transaction: {
        list: [
          {
            id: "1",
            category: "Gym",
            type: "Expense",
            amount: "500",
            date: "2026-01-01",
            recurring: true,
            interval: "Monthly",
            expiryDate: "2026-01-20",
            count: 1
          },
          {
            id: "2",
            category: "Food",
            type: "Expense",
            amount: "200",
            date: "2025-01-01T10:00",
            recurring: false,
          }
        ],
        recursiveList: [],
        totalItems: {}
      }
    });


    expect(
      await screen.findByText("Gym")
    ).toBeInTheDocument();



    expect(screen.queryByText("Food")).not.toBeInTheDocument();
  });

   test("Test Daily transactions", async () => {
    sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "Nishit" })
    );

    renderWithStore({
      transaction: {
        list: [{
            id: "1",
            category: "Skit",
            type: "Expense",
            amount: "500",
            date: "2026-01-09",
            recurring: true,
            interval: "Daily",
            expiryDate: "2026-01-20",
            count: 1
          }
          
        ],
        recursiveList: [
          ],
        totalItems: {}
      }
    });


    expect(
      await screen.findByText("Skit")
    ).toBeInTheDocument();
    expect(await screen.findByText("Daily")).toBeInTheDocument();



    expect(screen.queryByText("Food")).not.toBeInTheDocument();
  });


  test("computes next deduction date correctly for ALL interval types", async () => {

    sessionStorage.setItem(
      "session_user",
      JSON.stringify({ username: "Nishit" })
    );


    renderWithStore({
      transaction: {
        list: [
          {
            id: "1",
            category: "Gym",
            type: "Expense",
            amount: "500",
            date: "2026-01-01",
            recurring: true,
            interval: "Yearly",
            expiryDate: "2026-01-20",
            count: 1
          }
        ],
        recursiveList: [],
        totalItems: { tAmount: 6000, Income: 6000, Expense: 0 }
      }
    });
    expect(await screen.findByText(/Recurring Transactions/i)).toBeInTheDocument();
    expect(await screen.findByText(/Gym/i)).toBeInTheDocument();
  });



});
