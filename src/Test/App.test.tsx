import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import transactionReducer, { addTransaction, editTransaction } from "../components/slice/transactionSlice";
import loginReducer from '../components/slice/loginSlice'

import Login from "../components/Login";
import Dashboard from "../components/Pages/Dashboard";
import App from "../App";

jest.mock("uuid", () => ({
  v4: () => "static-id-123"
}));

const renderWithProviders = (ui: React.ReactNode, preloadedState = {}) => {
  const store = configureStore({
    reducer: { transaction: transactionReducer, auth:loginReducer},
    preloadedState
  });

  const dispatchSpy = jest.spyOn(store, "dispatch");

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        {ui}
      </MemoryRouter>
    </Provider>
  );

  return { store, dispatchSpy };
};
// beforeEach(() => {
//   sessionStorage.clear();
//   jest.clearAllMocks();

//   global.fetch = jest.fn();
// });



test("Test the successful login", async () => {
  sessionStorage.setItem(
    "session_user",
    JSON.stringify({
      username: "Nishit",
    //   accessToken: "valid-token",
    //   refreshToken: "refresh-token",
      expiresAt: Date.now() + 5000,
    })
  );

  renderWithProviders(<App />, {
  auth: {
    user: {
      username: "emilys",
      accessToken: "valid-token",
      refreshToken: "refresh-token",
      expiresAt: Date.now() + 50000,
    },
    loading: false,
    error: null,
    restoring:false
  },
  transaction: {
    list: [],
    recursiveList: [],
    totalItems: {},
  },
});

  expect(await screen.findByText(/welcome emilys/i)).toBeInTheDocument();
});
