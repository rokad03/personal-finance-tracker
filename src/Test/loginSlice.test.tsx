import reducer, {
  loginRequest,
  loginSuccess,
  loginError,
  restoreSession,
  restoreFinished,
  logout,
} from "../components/slice/loginSlice";

describe("login slice", () => {

  const initial = {
    loading: false,
    users: null,
    restoring: true,
    error: undefined,
  };

  test("returns initial state", () => {
    expect(reducer(undefined, { type: "UNKNOWN" })).toEqual({
      loading: false,
      users: null,
      restoring: true,
    });
  });

  test("loginRequest execution", () => {
    const prev = { ...initial, restoring: false };

    const state = reducer(prev, loginRequest({ username: "a", password: "b" }));

    expect(state).toEqual({
      ...prev,
      loading: true,
    });
  });

  test("loginSuccess", () => {
    const user = { username: "john", password: "123" };

    const state = reducer(
      { ...initial, loading: true },
      loginSuccess(user)
    );

    expect(state).toEqual({
      loading: false,
      users: user,
      restoring: false,
    });
  });

  test("loginError", () => {
    const state = reducer(
      { ...initial, loading: true },
      loginError("Invalid Credentials")
    );

    expect(state).toEqual({
      ...initial,
      loading: false,
      error: "Invalid Credentials",
      restoring: false,
    });
  });

  test("restoreSession", () => {
    const state = reducer(
      { ...initial, restoring: false },
      restoreSession()
    );

    expect(state.restoring).toBe(true);
  });

  test("restoreFinished", () => {
    const state = reducer(
      { ...initial, restoring: true },
      restoreFinished()
    );

    expect(state.restoring).toBe(false);
  });

  test("logout", () => {
    const state = reducer(
      {
        ...initial,
        users: { username: "abc", password: "123" },
        restoring: true,
      },
      logout()
    );

    expect(state).toEqual({
      error: "",
      users: null,
      restoring: false,
      loading:false
    });
  });
});
