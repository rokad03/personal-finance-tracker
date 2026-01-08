import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import transactionReducer, { deleteTransaction } from "../components/slice/transactionSlice";
import PaginationTable from "../components/Pages/PaginationTable";

let store: any;
let dispatchSpy: any;

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid-123"),
}));

const renderWithStore = (preloadedState={}) => {
  store = configureStore({
    reducer: { transaction: transactionReducer },
    preloadedState
  });

  dispatchSpy = jest.spyOn(store, "dispatch");

  return render(
    <Provider store={store}>
      <PaginationTable />
    </Provider>
  );
};

describe("PaginationTable", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders transaction row", () => {
    renderWithStore({
      transaction: {
        list: [
          {
            id: "1",
            type: "Expense",
            amount: "200",
            date: "2024-01-01",
            recurring: false,
            count: 1,
            category: "Food"
          }
        ],
        recursiveList:[],
        totalItems: {}
      }
    });

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  test("delete button dispatches deleteTransaction", () => {
    renderWithStore({
      transaction: {
        list: [
          {
            id: "99",
            type: "Expense",
            amount: "100",
            date: "2024-01-01",
            recurring: false,
            count: 1,
            category: "Snacks"
          }
        ],
        recursiveList:[],
        totalItems: {}
      }
    });

    fireEvent.click(screen.getByText("Delete"));

    expect(dispatchSpy).toHaveBeenCalledWith(deleteTransaction("99"));
  });

  test("edit button opens TransactionForm", () => {
    renderWithStore({
      transaction: {
        list: [
          {
            id: "55",
            type: "Income",
            amount: "500",
            date: "2024-01-01",
            recurring: false,
            count: 1,
            category: "Salary"
          }
        ],
        recursiveList:[],
        totalItems: {}
      }
    });

    fireEvent.click(screen.getByText("Edit"));

    
    expect(screen.getByText(/Transaction/i)).toBeInTheDocument();
  });
  test("dispatches total with correct computed values including top3 sorting", () => {
  const preState = {
    transaction: {
      list: [
        { id: "1", type: "Expense", amount: "100", date: "2024-01-01", recurring:false, count:1, category:"Food" },
        { id: "2", type: "Expense", amount: "300", date: "2024-01-02", recurring:false, count:1, category:"Rent" },
        { id: "3", type: "Expense", amount: "200", date: "2024-01-03", recurring:false, count:1, category:"Snacks" },

        { id: "4", type: "Income", amount: "500", date: "2024-01-01", recurring:false, count:1, category:"Job" },
        { id: "5", type: "Income", amount: "400", date: "2024-01-02", recurring:false, count:1, category:"Bonus" },
        { id: "6", type: "Income", amount: "100", date: "2024-01-03", recurring:false, count:1, category:"Gift" },
      ],
      recursiveList:[],
      totalItems: {}
    }
  };

  renderWithStore(preState);

  
  const expectedTotal = 1600;
  const expectedExpense = 600;
  const expectedIncome  = 1000;

 
  const expectedTop3Expense = [
    { category:"Rent", amount:300 },
    { category:"Snacks", amount:200 },
    { category:"Food", amount:100 }
  ];

  const expectedTop3Income = [
    { category:"Job", amount:500 },
    { category:"Bonus", amount:400 },
    { category:"Gift", amount:100 },
  ];

  expect(dispatchSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "transactons/total",
      payload: {
        tAmount: expectedTotal,
        Income: expectedIncome,
        Expense: expectedExpense,
        top3Expense: expectedTop3Expense,
        top3Income: expectedTop3Income
      }
    })
  );
});
test("closing TransactionForm removes it from DOM", () => {
  renderWithStore({
    transaction: {
      list: [
        {
          id: "55",
          type: "Income",
          amount: "500",
          date: "2024-01-01",
          recurring: false,
          count: 1,
          category: "Salary"
        }
      ],
      recursiveList:[],
      totalItems: {}
    }
  });

  fireEvent.click(screen.getByText("Edit"));

  const dialog = screen.getByText(/Transaction/i);
  expect(dialog).toBeInTheDocument();

  
  fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

  expect(screen.queryByText(/Transaction/i)).toBeNull();
});

});
