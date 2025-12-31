import { configureStore } from "@reduxjs/toolkit";
import Transaction from "../components/Pages/Transaction";
import transactionReducer from "../components/slice/transactionSlice"
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
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
    // const CheckInput = screen.getByTestId("check")
    const Button = screen.getByTestId("Btn")
    expect(Inputamount).toBeInTheDocument();
    expect(InputCategory).toBeInTheDocument();
    expect(InputType).toBeInTheDocument();
    expect(InputDate).toBeInTheDocument();
    // expect(CheckInput).not.toBeChecked();
    expect(Button).toBeInTheDocument();

})
 


test("Test the initial Transaction form", async () => {
  const user = userEvent.setup();
  renderWithProviders();

  const amountInput = screen.getByTestId("amount");
  const categoryInput = screen.getByTestId("Category");
  const dateInput = screen.getByTestId("date")
  const checkbox = screen.getByLabelText(/mark as recurring/i);
  const button = screen.getByTestId("Btn");

  const typeSelect = screen.getByRole("combobox", { name: /type/i });
   await user.click(typeSelect);
   await user.click(await screen.findByRole("option", { name: /income/i }));

 
  await user.type(amountInput, "200");
  await user.clear(categoryInput)
  await user.type(categoryInput, "Sports");


  await user.type(dateInput,"2026-01-01")
  expect(dateInput).toHaveValue("2026-01-01")

  expect(checkbox).not.toBeChecked();
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked()


  expect(button).toBeEnabled();

  await user.click(button);


  expect(await screen.findByText("Sports")).toBeInTheDocument();
  expect(await screen.findByText("200")).toBeInTheDocument();
    expect(await screen.findByText("2026-01-01")).toBeInTheDocument();
  expect(await screen.findByText("200")).toBeInTheDocument();
  expect(await screen.findByText("Income")).toBeInTheDocument();
});