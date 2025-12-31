import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Recurring from "../components/Pages/Recurring";
import transactionReducer from "../components/slice/transactionSlice";

const renderWithStore = (preloadedState={}) => {
  const store = configureStore({
    reducer: { transaction: transactionReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <Recurring />
    </Provider>
  );
};

const addDays = (dateStr: string, days: number) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  return dt.toISOString().slice(0, 10);
};

describe("Recurring Page", () => {

  test("No recurring transactions exist", () => {
    renderWithStore({
      transaction: { list: [], totalItems: {} },
    });

    expect(screen.getByText("No transactions found")).toBeInTheDocument();
  });

  test("renders recurring only & next autopay date", () => {
    renderWithStore({
      transaction: {
        list: [
          {
            id: "1",
            type: "Expense",
            amount: "100",
            date: "2025-01-01",
            recurring: true,
            category: "Gym",
            count: 1,
          },
          {
            id: "2",
            type: "Income",
            amount: "200",
            date: "2025-01-02",
            recurring: false,
            category: "Salary",
            count: 1,
          },
        ],
        totalItems: {},
      },
    });

    expect(screen.getByText("Gym")).toBeInTheDocument();
    expect(screen.queryByText("Salary")).not.toBeInTheDocument();

    expect(
      screen.getByText(addDays("2025-01-01", 30))
    ).toBeInTheDocument();
  });

  test("sort button sorts transactions desc", async () => {
    const user = userEvent.setup();

    renderWithStore({
      transaction: {
        list: [
          { id:"1", type:"Expense", amount:"100", date:"2025-01-01", recurring:true, category:"A", count:1 },
          { id:"2", type:"Expense", amount:"300", date:"2025-01-01", recurring:true, category:"B", count:1 },
        ],
        totalItems:{},
      },
    });

    await user.click(screen.getByText("Sort By Amount"));

    const rows = screen.getAllByRole("row").slice(1); 

    expect(rows[0]).toHaveTextContent("300");
    expect(rows[1]).toHaveTextContent("100");
  });

  test("pagination buttons work", async () => {
  const user = userEvent.setup();


  const items = Array.from({ length: 15 }).map((_, i) => ({
    id: String(i),
    type: "Expense",
    amount: "10",
    date: "2025-01-01",
 	recurring: true,
    category: `Item ${i}`,
    count: 1,
  }));

  renderWithStore({
    transaction: { list: items, totalItems: {} },
  });

  expect(screen.getByText(/1 of 2/i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /^next$/i }));
  expect(screen.getByText(/2 of 2/i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /^prev$/i }));
  expect(screen.getByText(/1 of 2/i)).toBeInTheDocument();
});


  test("next autopay always adds 30 days", () => {
    renderWithStore({
      transaction: {
        list: [
          {
            id:"1",
            type:"Expense",
            amount:"10",
            date:"2025-02-01",
            recurring:true,
            category:"Netflix",
            count:1
          }
        ],
        totalItems:{}
      }
    });

    expect(
      screen.getByText(addDays("2025-02-01", 30))
    ).toBeInTheDocument();
  });
});
