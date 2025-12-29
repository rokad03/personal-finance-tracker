import { render,screen } from "@testing-library/react"
import Transaction from "../components/Pages/Transaction"
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom";
import transactionReducer from "../components/slice/transactionSlice";

const rootReducer = combineReducers({
  transaction: transactionReducer,
});

type RootState = ReturnType<typeof rootReducer>;
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));
const renderWithProviders = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
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


test("Test the initial transaction",()=>{
    renderWithProviders();
    expect(screen.getByText("Add Transaction")).toBeInTheDocument();
})