import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import transactionReducer from "../components/slice/transactionSlice";
import Transaction from "../components/Pages/Transaction";
import userEvent from "@testing-library/user-event";

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
        <Transaction />
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
    renderWithProviders();
    expect(mockedNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  test("Get the button and Transactionform",async()=>{
    const user=userEvent.setup();
    renderWithProviders();
    const formButton=await screen.findByRole("button",{name:"Add the transaction"})
    await user.click(formButton);
    expect(await screen.findByText("Add Transaction")).toBeInTheDocument();

    const cancelButton=await screen.findByRole("button",{name:/cancel/i});
    await user.click(cancelButton);
    expect(screen.queryByText("Add Transaction")).not.toBeInTheDocument();

  })
  test("clears all transactions when 'Clear all transactions' is clicked", async () => {
    const user = userEvent.setup();
    
    const initialState = {
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
    };

    renderWithProviders(initialState);
    
   
    const clearButton = screen.getByRole("button", { name: /clear all transactions/i });
    await user.click(clearButton);
    expect(screen.queryByText("Gym")).not.toBeInTheDocument();

   
  });
})