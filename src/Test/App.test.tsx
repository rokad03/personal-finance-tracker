import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import {store} from '../components/store/store'
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import { restoreSession } from "../components/slice/loginSlice";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../components/slice/loginSlice";


test("restores session on app load", async () => {
  sessionStorage.setItem(
    "session_user",
    JSON.stringify({
      accessToken: "token",
      refreshToken: "refresh",
      expiresAt: Date.now() + 10000,
    })
  );

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </Provider>
  );

  expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
});

test("refreshes access token when expired", async () => {
  sessionStorage.setItem(
    "session_user",
    JSON.stringify({
      accessToken: "old-token",
      refreshToken: "valid-refresh",
      expiresAt: Date.now() - 1000, 
    })
  );

  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    }),
  } as Response);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </Provider>
  );

 
  expect(await screen.findByText(/welcome/i)).toBeInTheDocument();

  const updatedSession = JSON.parse(
    sessionStorage.getItem("session_user")!
  );

  expect(updatedSession.accessToken).toBe("new-access-token");
  expect(updatedSession.refreshToken).toBe("new-refresh-token");
});

test("logs out when refresh token missing", async () => {
  sessionStorage.setItem(
    "session_user",
    JSON.stringify({
      accessToken: "expired-token",
      expiresAt: Date.now() - 1000, 
     
    })
  );

  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );

  expect(
    await screen.findByText(/Session expired — login again/i)
  ).toBeInTheDocument();

  // expect(sessionStorage.getItem("session_user")).toBeNull();
});

test("logs out when refresh API fails", async () => {

  sessionStorage.setItem(
    "session_user",
    JSON.stringify({
      accessToken: "expired-token",
      refreshToken: "valid-refresh",
      expiresAt: Date.now() - 1000, 
    })
  );


  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: false, 
  } as Response);

  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );

  
  expect(
    await screen.findByText(/Session expired — login again/i)
  ).toBeInTheDocument();

  
  expect(sessionStorage.getItem("session_user")).toBeNull();
});

describe("ProtectedRoute", () => {
  test("dispatches restoreSession when token is expired", () => {
    const expiredTime = Date.now() - 1000;

    const store = configureStore({
      reducer: {
        auth: authReducer,
      } as any,
      preloadedState: {
        auth: {
          users: {
            username: "test",
            accessToken: "expired-token",
            refreshToken: "refresh-token",
            expiresAt: expiredTime,
          },
          restoring: false,
          loading: false,
          error: null,
        },
      },
    });

    const dispatchSpy = jest.spyOn(store, "dispatch");

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalledWith(restoreSession());
  });
});