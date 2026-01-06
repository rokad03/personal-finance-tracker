import { configureStore } from "@reduxjs/toolkit";
import Transaction from "../components/Pages/Transaction";
import transactionReducer from "../components/slice/transactionSlice";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";



const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate
}));

const mockGet = jest.spyOn(Storage.prototype, "getItem");
const mockSet = jest.spyOn(Storage.prototype, "setItem");

jest.mock("uuid", () => ({
  v4: () => "static-uuid-123"
}));



jest.mock("../components/Pages/PaginationTable", () => () => (
  <div>TABLE</div>
));


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


describe("Transaction Page", () => {

  beforeEach(() => {
     mockGet.mockReturnValue(JSON.stringify({ username: "Nishit" }));
    jest.clearAllMocks();
  });


  test("redirects to login if no user session exists", () => {
    mockGet.mockReturnValue(null);
    renderWithProviders();

    expect(mockedNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  test("renders Add button but form hidden initially", () => {
    renderWithProviders();

    expect(screen.getByText("Add the transaction")).toBeInTheDocument();

    expect(screen.queryByTestId("amount")).not.toBeInTheDocument();
  });


  test("fills and submits transaction form", async () => {
    const user = userEvent.setup();

    renderWithProviders();

    await user.click(screen.getByText("Add the transaction"));

    const amount = await screen.findByTestId("amount");
    const category = screen.getByTestId("Category");
    const date = screen.getByTestId("date");
    const typeSelect = screen.getByRole("combobox", { name: /type/i });
    const submit = screen.getByRole("button", { name: /add/i });

    await user.type(amount, "200");
    await user.type(category, "Sports");

    await user.click(typeSelect);
    await user.click(await screen.findByRole("option", { name: /income/i }));

    await user.type(date, "2026-01-01T10:00");

    expect(submit).toBeEnabled();

    await user.click(submit);

    expect(screen.queryByTestId("amount")).not.toBeInTheDocument();
  });
});
