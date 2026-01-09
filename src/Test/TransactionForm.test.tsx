import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import transactionReducer, { addTransaction, editTransaction } from "../components/slice/transactionSlice";
import TransactionForm from "../components/Pages/TransactionForm";
import { Type } from "../Types/types";

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

  await user.type(screen.getByTestId("amount"), "100");
  await user.type(screen.getByTestId("Category"), "Food");

  await user.click(screen.getByRole("combobox", { name: /type/i }));
  await user.click(screen.getByRole("option", { name: /income/i }));

  await user.type(screen.getByTestId("date"), "2026-01-08");

  await user.click(screen.getByLabelText(/mark as recurring/i));

  const submit = screen.getByRole("button", { name: /add/i });
  expect(submit).toBeDisabled();

  const selects = screen.getAllByRole("combobox");
  await user.click(selects[1]);
  await user.click(screen.getByRole("option", { name: /monthly/i }));

  await user.type(screen.getByTestId("expiryDate"), "2026-01-05");

  expect(submit).toBeEnabled();
  await user.click(submit)
  expect(await screen.findByText(/Expiry Date should be Greater then or Equal Transaction Date/i)).toBeInTheDocument();

});


  test("blocks expense when balance too low", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <TransactionForm onClose={jest.fn()} />,
      { transaction: { list: [], totalItems: { Income: 0, Expense: 0 } } }
    );

    await user.type(screen.getByTestId("amount"), "500");
    await user.type(screen.getByTestId("Category"), "Laptop");

    await user.click(screen.getByRole("combobox", { name: /type/i }));
    await user.click(screen.getByRole("option", { name: /expense/i }));

    await user.type(screen.getByTestId("date"), "2026-01-01");

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(
      await screen.findByText(/income is less than or equal/i)
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
      type: "Income" as Type,
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
