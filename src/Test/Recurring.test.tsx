import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import Recurring from "../components/Pages/Recurring";
import transactionReducer from "../components/slice/transactionSlice";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate
}));


const renderWithStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: { transaction: transactionReducer },
    preloadedState
  });

  return render(
    <Provider store={store}>
      <Recurring />
    </Provider>
  );
};


const addDays = (date: string, days: number) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d + days).toISOString().slice(0, 10);
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
      transaction: { list: [], totalItems: {} }
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
          date: "2025-01-01T10:00",
          recurring: true,
          interval: "monthly",
          count: 1
        },
        {
          id: "2",
          category: "Food",
          type: "Expense",
          amount: "200",
          date: "2025-01-01T10:00",
          recurring: false,
          count: 1
        }
      ],
      totalItems: {}
    }
  });

  // ⬇️ WAIT for table to render
  expect(await screen.findByText("Gym")).toBeInTheDocument();

  // ⬇️ Food must NOT render
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
          category: "MonthlyPlan",
          type: "Expense",
          amount: "300",
          date: "2025-02-01T08:00",
          recurring: true,
          interval: "monthly",
          count: 1
        },
        {
          id: "2",
          category: "DailyPlan",
          type: "Expense",
          amount: "100",
          date: "2025-02-01T08:00",
          recurring: true,
          interval: "daily",
          count: 1
        },
        {
          id: "3",
          category: "YearlyPlan",
          type: "Expense",
          amount: "500",
          date: "2025-02-01T08:00",
          recurring: true,
          interval: "yearly",
          count: 1
        },
        {
          id: "4",
          category: "WeirdPlan",
          type: "Expense",
          amount: "50",
          date: "2025-02-01T08:00",
          recurring: true,
          interval: "weird",
          count: 1
        }
      ],
      totalItems: {}
    }
  });

  // wait for table render
  await screen.findByText("MonthlyPlan");

  expect(
    screen.getByText(addDays("2025-02-01", 31))
  ).toBeInTheDocument();

  expect(
    screen.getByText(addDays("2025-02-01", 2))
  ).toBeInTheDocument();

  expect(
    screen.getByText(addDays("2025-02-01", 365))
  ).toBeInTheDocument();

  expect(
    screen.getByText(addDays("2025-02-01", 0))
  ).toBeInTheDocument();
});


});
