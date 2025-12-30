import { configureStore } from "@reduxjs/toolkit";
import Transaction from "../components/Pages/Transaction";
import transactionReducer from "../components/slice/transactionSlice"
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

jest.mock('uuid', () => ({
    v4: () => '1234-adas-23232',
}))

const renderWithProviders = (preloadedState = {}) => {
    const store = configureStore({
        reducer: { transaction: transactionReducer },
        preloadedState
    });

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <Transaction />
            </MemoryRouter>
        </Provider>
    );
};

test("Initial TransactionPage",()=>{
   
   renderWithProviders();
   expect(screen.getByText("Add Transaction")).toBeInTheDocument()
   const Inputamount = screen.getByTestId("amount")
    const InputCategory = screen.getByTestId("Category")
    const InputType = screen.getByTestId("Type")
    const InputDate = screen.getByTestId("date")
    const CheckInput = screen.getByTestId("check")
    const Button = screen.getByTestId("Btn")
    expect(Inputamount).toBeInTheDocument();
    expect(InputCategory).toBeInTheDocument();
    expect(InputType).toBeInTheDocument();
    expect(InputDate).toBeInTheDocument();
    expect(CheckInput).not.toBeChecked();
    expect(Button).toBeInTheDocument();

})
 


test.skip("Test the initial Transaction form", async () => {

    const user = userEvent.setup();
    renderWithProviders();
    expect(screen.getByText("Add Transaction")).toBeInTheDocument();

    const Inputamount = screen.getByTestId("amount")
    const InputCategory = screen.getByTestId("Category")
    // const InputType = screen.getByTestId("Type")
    const InputDate = screen.getByTestId("date")
    const CheckInput = screen.getByTestId("check")
    const Button = screen.getByTestId("Btn")

    await user.type(Inputamount, "200");

    await user.type(InputCategory, "Sports");


    // await user.selectOptions(InputType, "Expense");


    await user.type(InputDate, "2026-01-01");

    await user.click(CheckInput);

    await user.click(Button)

    // expect(await screen.findByText("200")).toBeInTheDocument();
    expect(await screen.findByText("Sports")).toBeInTheDocument();
    // expect(await screen.findByText("Expense")).toBeInTheDocument();
    expect(await screen.findByText("2025-01-01")).toBeInTheDocument();
    expect(await screen.findByText("True")).toBeInTheDocument();



})

