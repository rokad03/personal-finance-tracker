import { runSaga } from "redux-saga";

import {
  loginRequest,
  loginSuccess,
  loginError,
} from "../components/slice/loginSlice";

import {
  handleLogin,
  handleRestore,
  handleLogout,
} from "../components/saga/fetchUserSaga"


// Ensure clean mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
  sessionStorage.clear();

  // cleanup fetch
  delete (global as any).fetch;
});


// =============================
// LOGIN SUCCESS
// =============================
test("login success dispatches loginSuccess and stores session", async () => {

  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      token: "access123",
      refreshToken: "refresh123",
    }),
  });

  const dispatched: any[] = [];

  await runSaga(
    { dispatch: (a) => dispatched.push(a) },
    handleLogin,
    loginRequest({ username: "kminchelle", password: "0lelplR" })
  ).toPromise();

  expect(global.fetch).toHaveBeenCalledTimes(1);

  expect(dispatched).toContainEqual(
    expect.objectContaining({ type: loginSuccess.type })
  );

  expect(sessionStorage.getItem("session_user")).not.toBeNull();
});


// =============================
// LOGIN FAILURE
// =============================
test("login failure dispatches loginError", async () => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: false,
  });

  const dispatched: any[] = [];

  await runSaga(
    { dispatch: (a) => dispatched.push(a) },
    handleLogin,
    loginRequest({ username: "wrong", password: "wrong" })
  ).toPromise();

  expect(dispatched).toContainEqual(
    loginError("Invalid username or password")
  );
});


// =============================
// RESTORE — TOKEN STILL VALID
// =============================
test("restores session when token not expired", async () => {
  const stored = {
    token: "abc",
    refreshToken: "xyz",
    expiresAt: Date.now() + 100000,
  };

  sessionStorage.setItem("session_user", JSON.stringify(stored));

  const dispatched: any[] = [];

  await runSaga(
    { dispatch: (a) => dispatched.push(a) },
    handleRestore
  ).toPromise();

  expect(dispatched).toContainEqual(loginSuccess(stored));
});


// =============================
// RESTORE — EXPIRED → REFRESH SUCCESS
// =============================
test("refreshes token when expired", async () => {
  const stored = {
    token: "old",
    refreshToken: "refresh123",
    expiresAt: Date.now() - 1000,
  };

  sessionStorage.setItem("session_user", JSON.stringify(stored));

  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ token: "newAccessToken" }),
  });

  const dispatched: any[] = [];

  await runSaga(
    { dispatch: (a) => dispatched.push(a) },
    handleRestore
  ).toPromise();

  expect(dispatched).toContainEqual(
    expect.objectContaining({ type: loginSuccess.type })
  );

  const updated = JSON.parse(sessionStorage.getItem("session_user")!);
  expect(updated.accessToken).toBe("newAccessToken");
});


// =============================
// RESTORE — EXPIRED → REFRESH FAILS
// =============================
test("refresh failure logs user out", async () => {
  const stored = {
    token: "old",
    refreshToken: "bad",
    expiresAt: Date.now() - 1000,
  };

  sessionStorage.setItem("session_user", JSON.stringify(stored));

  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: false,
  });

  const dispatched: any[] = [];

  await runSaga(
    { dispatch: (a) => dispatched.push(a) },
    handleRestore
  ).toPromise();

  expect(sessionStorage.getItem("session_user")).toBeNull();

  expect(dispatched[0].type).toBe(loginError.type);
});


// =============================
// LOGOUT
// =============================
test("logout clears session", async () => {
  sessionStorage.setItem("session_user", "123");

  await runSaga({}, handleLogout).toPromise();

  expect(sessionStorage.getItem("session_user")).toBeNull();
});
