
import { configureStore } from '@reduxjs/toolkit';

import createSagaMiddleware from 'redux-saga';
import loginReducer from '../slice/loginSlice';
import usersRootSaga from '../saga/rootSaga';
import transactionReducer from '../slice/transactionSlice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: loginReducer,
    transaction:transactionReducer
  },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  
});
store.subscribe(() => {
  const state = store.getState();

  sessionStorage.setItem(
    "transaction",
    JSON.stringify(state.transaction.list)
  );
});
sagaMiddleware.run(usersRootSaga);



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


