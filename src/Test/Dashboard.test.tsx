

import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../components/Pages/Dashboard";
import transactionReducer, { transactions } from "../components/slice/transactionSlice";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
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
        renderWithProviders();
        expect(mockedNavigate).toHaveBeenCalledWith("/login", { replace: true });
    });

    test("Renders the initial Dashboard Screen", () => {
        sessionStorage.setItem("session_user", JSON.stringify({ username: "Nishit" }));

        renderWithProviders();

        expect(screen.getByText("Total Income")).toBeInTheDocument();
        expect(screen.getByText("Total Expenses")).toBeInTheDocument();
        expect(screen.getByText("Current Balance")).toBeInTheDocument();
        expect(screen.getAllByRole("heading", { level: 5 })).toHaveLength(3)
    })
    test("renders transaction data when user session and data are present", async () => {
        const mockTransaction = {
            id: "1",
            type: "Expense",
            amount: "200",
            date: "2025-12-01",
            recurring: true,
            count: 1,
            category: "Sports",
        };

        sessionStorage.setItem("session_user", JSON.stringify({ username: "Nishit" }));

        renderWithProviders({
            transaction: {
                transactions: [mockTransaction],
                totalItems: {
                    tAmount: 200,
                    Income: 0,
                    Expense: 200,
                    top5: [{category:"Sports",amount:200}]
                },
                loading: false
            },
        });
        expect(screen.getByText(/Sports/i)).toBeInTheDocument();
        expect(screen.getAllByText("200")).toHaveLength(2);
        expect(screen.getByText("-200")).toBeInTheDocument();
    });

    test("Check the top5 Categires", () => {
        const mockTransactions = [{
            id: "1",
            type: "Expense",
            amount: "200",
            date: "2025-12-01",
            recurring: true,
            count: 1,
            category: "Sports",
        },
        {
            id: "2",
            type: "Income",
            amount: "200",
            date: "2025-12-01",
            recurring: true,
            count: 1,
            category: "Sports",
        }];
        sessionStorage.setItem("session_user", JSON.stringify({ username: "Nishit" }));
        renderWithProviders({
            transaction: {
                transactions: mockTransactions,
                totalItems: {
                    tAmount: 400,
                    Income: 0,
                    Expense: 200,
                    top5:[{category:"Sports",amount:400}]
                },
                loading: false
            },
        });
       expect(screen.getByText("400")).toBeInTheDocument();
    });
})