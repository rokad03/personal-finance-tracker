import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { combineReducers, configureStore} from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import transactionReducer, { transactions, Type } from "../components/slice/transactionSlice";
import Recurring from "../components/Pages/Recurring";
import userEvent from "@testing-library/user-event";
import { exec } from "child_process";

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

   render(
    <Provider store={store}>
      <MemoryRouter>
        <Recurring />
      </MemoryRouter>
    </Provider>
  );

 
};

describe("Recurring Component", () => {
  const mockTransactions = [
    { 
      id:"",
      date: "2026-01-10", 
      type: "Expense" as Type, 
      category: "Rent", 
      amount: "1000", 
      recurring: true, 
      count: 1 
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders recurring transactions correctly and calculates next auto pay", () => {
    renderWithProviders({
      transaction: { 
        list: mockTransactions,
        totalItems: { tAmount: 0, Income: 0, Expense: 0, top5: [] } 
      },
    });
    expect(screen.getByText("Rent")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("Expense")).toBeInTheDocument();    
    expect(screen.getByText("2026-01-10")).toBeInTheDocument();
    expect(screen.getByText("2026-02-08")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("shows empty state message when no recurring transactions exist", () => {
    renderWithProviders({
      transaction: { 
        list: [], 
        totalItems: { tAmount: 0, Income: 0, Expense: 0, top5: [] } 
      },
    });

    expect(screen.getByText(/no transactions found/i)).toBeInTheDocument();
  });


  test("pagination buttons are disabled/enabled correctly", () => {
    
    renderWithProviders({
      transaction: { 
        list: mockTransactions,
        totalItems: { tAmount: 0, Income: 0, Expense: 0, top5: [] } 
      },
    });

    const prevButton = screen.getByRole("button", { name: /prev/i });
    const nextButton = screen.getByRole("button", { name: /next/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  test("Test previous and next button",async ()=>{
    const user=userEvent.setup();
    const mockLargeTransactions = Array.from({ length: 12 }, (_, i) => ({
            id: `${i}`,
            date: "2025-01-01",
            type: "Expense" as Type,
            category: `Rent ${i + 1}`, 
            amount: `1000 + ${i}`,
            recurring: true,
            count: 1,
        }));
        console.log("mock",mockLargeTransactions)
        renderWithProviders({
            transaction: {
                list: mockLargeTransactions,
                totalItems: { tAmount: 0, Income: 0, Expense: 0, top5: [] }
            },
        });
         const prevButton = screen.getByRole("button", { name: /prev/i });
         const nextButton = screen.getByRole("button", { name: /next/i });

         expect(prevButton).toBeDisabled();
         expect(nextButton).not.toBeDisabled();

        await user.click(nextButton)
        expect(prevButton).not.toBeDisabled();
        expect(nextButton).toBeDisabled();

        await user.click(prevButton);
        expect(prevButton).toBeDisabled();
        expect(nextButton).not.toBeDisabled();


  })

});
