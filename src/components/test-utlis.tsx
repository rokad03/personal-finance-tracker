import { ReactNode } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { render } from "@testing-library/react";

import authReducer from "../components/slice/loginSlice";
import transactionReducer from "../components/slice/transactionSlice";
import rootSaga from "../components/saga/rootSaga";

export function renderWithStore(
  ui: ReactNode,
  {
    route = "/",
    preloadedState = {},
  }: {
    route?: string;
    preloadedState?: any;
  } = {}
) {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: {
      auth: authReducer,
      transaction: transactionReducer,
    } as any,
    middleware: (gDM) =>
      gDM({ thunk: false }).concat(sagaMiddleware),
    preloadedState,
  });

  sagaMiddleware.run(rootSaga);

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {ui}
        </MemoryRouter>
      </Provider>
    ),
  };
}
