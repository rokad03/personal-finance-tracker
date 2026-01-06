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

jest.mock("uuid", () => ({
  v4: () => "static-id-123"
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
          date: "2026-01-01T10:00",
          recurring: true,
          interval: "Monthly",
          expiryDate:"2026-01-20T10:00",
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
      totalItems: {}
    }
  });

 
  expect(
  await screen.findByText("Gym")
).toBeInTheDocument();


  
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
          interval: "Monthly",
          expiryDate:"2026-01-20T10:00",
          count: 1
        },
        {
          id: "2",
          category: "DailyPlan",
          type: "Expense",
          amount: "100",
          date: "2025-02-01T08:00",
          recurring: true,
          interval: "Daily",
          expiryDate:"2026-01-20T10:00",
          count: 1
        },
        {
          id: "3",
          category: "YearlyPlan",
          type: "Expense",
          amount: "500",
          date: "2025-02-01T08:00",
          recurring: true,
          interval: "Yearly",
          expiryDate:"2026-01-20T10:00",
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
          expiryDate:"2026-01-20T10:00",
          count: 1
        }
      ],
      totalItems: {}
    }
  });

  
  await screen.findByText("MonthlyPlan");
   expect(
    await screen.findByText(/2025-03-03/))
  .toBeInTheDocument();

  const dateString = addDays("2025-02-01", 31); 
  expect(
    await screen.findByText(new RegExp(dateString,"i"))
  ).toBeInTheDocument();

  const DailyDateString=addDays("2025-02-01", 2)
  expect(
    await screen.findByText(new RegExp(DailyDateString,"i"))
  ).toBeInTheDocument();

  const yearlyDateString=addDays("2025-02-01",365)
  expect(
    await screen.findByText(new RegExp(yearlyDateString,"i"))
  ).toBeInTheDocument();

  const wieredDateString=addDays("2025-02-01", 0)
  expect(
    await screen.findByText(new RegExp(wieredDateString,"i"))
  ).toBeInTheDocument();
});


});
