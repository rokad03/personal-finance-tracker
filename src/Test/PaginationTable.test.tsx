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
            date: "2024-01-01T10:00",
            recurring: false,
            count: 1,
            category: "Food"
          }
        ],
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
            date: "2024-01-01T10:00",
            recurring: false,
            count: 1,
            category: "Snacks"
          }
        ],
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
            date: "2024-01-01T10:00",
            recurring: false,
            count: 1,
            category: "Salary"
          }
        ],
        totalItems: {}
      }
    });

    fireEvent.click(screen.getByText("Edit"));

    
    expect(screen.getByText(/Transaction/i)).toBeInTheDocument();
  });
});
