import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import loginReducer, { restoreSession } from "./components/slice/loginSlice";
import transactionReducer from "./components/slice/transactionSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      auth: loginReducer,
      transaction: transactionReducer,
    },
  });
jest.mock('uuid', () => ({
    v4: () => '1234-adas-23232',
}))

test("App dispatches restoreSession on mount", () => {
  const store = makeStore();

  const spy = jest.spyOn(store, "dispatch");

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(spy).toHaveBeenCalledWith(restoreSession());
});
