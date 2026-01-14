import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import transactionReducer, { addTransaction, editTransaction } from "../components/slice/transactionSlice";
import TransactionForm from "../components/Pages/TransactionForm";
import { MethodType } from "../Types/types";

jest.mock("uuid", () => ({
  v4: () => "static-id-123"
}));

const renderWithProviders = (ui: React.ReactNode, preloadedState = {}) => {
  const store = configureStore({
    reducer: { transaction: transactionReducer },
    preloadedState
  });

  const dispatchSpy = jest.spyOn(store, "dispatch");

  render(
    <Provider store={store}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>
  );

  return { store, dispatchSpy };
};
jest.setTimeout(300000)
describe("TransactionForm", () => {

  test("submit disabled until form valid", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TransactionForm onClose={jest.fn()} />);

    const submit = screen.getByRole("button", { name: /add/i });
    expect(submit).toBeDisabled();

    await user.type(screen.getByTestId("amount"), "100");
    await user.type(screen.getByTestId("Category"), "Food");

    await user.click(screen.getByRole("combobox", { name: /type/i }));
    await user.click(screen.getByRole("option", { name: /income/i }));

    await user.type(screen.getByTestId("date"), "2026-01-01");

    expect(submit).toBeEnabled();
  });

  test("recurring requires interval & expiry", async () => {
  const user = userEvent.setup();

  renderWithProviders(<TransactionForm onClose={jest.fn()} />);

    const amount = await screen.findByTestId("amount");
    expect(amount).toBeInTheDocument();
      const category = await  screen.findByTestId("Category");
      const date = await screen.findByTestId("date");

  await user.type(amount, "100");
  await user.type(category, "Food");

  await user.click(screen.getByLabelText(/MoneyType/i));
  await user.click(screen.getByRole("option", { name: /income/i }));
  expect(screen.getByTestId('Type')).toHaveValue("Income");

  await user.type(date, "2026-01-08");
  expect(date).toHaveValue("2026-01-08")
  const submit = screen.getByRole("button", { name: /add/i });
  expect(submit).toBeEnabled();

  const checkbox = await screen.findByRole('checkbox', { name: /mark as recurring/i })
  await user.click(checkbox);
  expect(checkbox).toBeChecked();

  
  
  await user.click(screen.getByLabelText(/Interval/i));
  await user.click(screen.getByRole("option",{name:/Daily/i}))
  expect(screen.getByTestId('Recurring-type')).toHaveValue('Daily')

  // const selects = screen.getAllByRole("combobox");
  // await user.click(selects[1]);
  // await user.click(screen.getByRole("option", { name: /monthly/i }));
  const expiryDate=await screen.findByTestId("expiryDate")
  await user.type(expiryDate, "2026-01-05");
   expect(expiryDate).toHaveValue("2026-01-05")
  expect(await screen.findByText(/Expiry date must be greater than transaction date/i)).toBeInTheDocument();

  expect(submit).not.toBeEnabled();
  // await user.click(submit)
  

});


  test("blocks expense when balance too low", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <TransactionForm onClose={jest.fn()} />,
      { transaction: { list: [], totalItems: { Income: 0, Expense: 0 } } }
    );

    await user.type(screen.getByTestId("amount"), "500");
    await user.type(screen.getByTestId("Category"), "Laptop");

    await user.click(screen.getByLabelText(/MoneyType/i));
    await user.click(screen.getByRole("option", { name: /expense/i }));

    await user.type(screen.getByTestId("date"), "2026-01-01");

    const submitbtn=screen.getByRole("button", { name: /add/i })
    expect(submitbtn).toBeEnabled();
    await user.click(submitbtn);

    expect(
      await screen.findByText(/Expense cannot exceed income/i)
    ).toBeInTheDocument();
  });

  test("dispatches addTransaction for new entry", async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();

  const { dispatchSpy } = renderWithProviders(
    <TransactionForm onClose={onClose} />,
    { transaction: { list: [], totalItems: { Income: 1000, Expense: 0 } } }
  );

  await user.type(screen.getByTestId("amount"), "200");
  await user.type(screen.getByTestId("Category"), "Food");

  await user.click(screen.getByRole("combobox", { name: /type/i }));
  await user.click(screen.getByRole("option", { name: /expense/i }));

  await user.type(screen.getByTestId("date"), "2026-01-01");

  await user.click(screen.getByRole("button", { name: /add/i }));

  expect(dispatchSpy).toHaveBeenCalledWith(
    expect.objectContaining({ type: addTransaction.type })
  );

  expect(onClose).toHaveBeenCalled();
});

  test("dispatches editTransaction when tx exists", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    const tx = {
      id: "abc",
      amount: "200",
      category: "Food",
      date: "2025-01-01T10:00",
      type: "Income" as MethodType,
      recurring: false,
      count: 1,
      expiryDate: "None",
      interval: ""
    };

    const { dispatchSpy } = renderWithProviders(
      <TransactionForm onClose={onClose} tx={tx} />,
      { transaction: { list: [], totalItems: { Income: 0, Expense: 0 } } }
    );

    await user.clear(screen.getByTestId("amount"));
    await user.type(screen.getByTestId("amount"), "300");

    await user.click(screen.getByRole("button", { name: /update/i }));

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: editTransaction.type })
    );

    expect(onClose).toHaveBeenCalled();

  });
});
