import { call, put } from "redux-saga/effects";
import { runSaga } from "redux-saga";
import { all } from "redux-saga/effects";
import rootSaga from "../components/saga/rootSaga";

import authSaga, {
  handleLogin,
  handleRestore,
  handleLogout,
} from "../components/saga/fetchUserSaga";

import {
  loginRequest,
  loginSuccess,
  loginError,
  restoreFinished,
} from "../components/slice/loginSlice";

import { fetchUsersApi } from "../components/api/fetchusers";
import { userAuthorisation } from "../components/api/userAuthorisation";


const mockSet = jest.spyOn(Storage.prototype, "setItem");
const mockGet = jest.spyOn(Storage.prototype, "getItem");
const mockRemove = jest.spyOn(Storage.prototype, "removeItem");

beforeEach(() => {
  jest.clearAllMocks();
});



describe("rootSaga", () => {
  test("starts authSaga inside all()", () => {
    const gen = rootSaga();
    const result = gen.next().value;

    expect(result).toEqual(
      all([
        authSaga()
      ])
    );

    expect(gen.next().done).toBe(true);
  });
});

describe("handleLogin", () => {
  test(" successful login", () => {
    const action = loginRequest({ username: "john", password: "123" });
    const gen = handleLogin(action);

    expect(gen.next().value).toEqual(call(fetchUsersApi));

    const mockUsers = {
      users: [{ username: "john", password: "123", id: 1 }],
    };

    expect(
      gen.next(mockUsers).value
    ).toEqual(call(userAuthorisation, { username: "john", password: "123" }));
    const mockAuth = { token: "abc" };

    const success = gen.next(mockAuth).value as any;

    expect(success.type).toBe(put(loginSuccess({}) as any).type);

    expect(gen.next().done).toBe(true);
  });

  test(" user not found", () => {
    const action = loginRequest({ username: "x", password: "y" });
    const gen = handleLogin(action);

    expect(gen.next().value).toEqual(call(fetchUsersApi));

    expect(gen.next({ users: [] }).value).toEqual(
      put(loginError("User not found"))
    );

    expect(gen.next().done).toBe(true);
  });

  test(" API throws", () => {
    const action = loginRequest({ username: "x", password: "y" });
    const gen = handleLogin(action);

    expect(gen.next().value).toEqual(call(fetchUsersApi));

    const err = new Error("bad");
    expect(gen.throw!(err).value).toEqual(put(loginError("bad")));

    expect(gen.next().done).toBe(true);
  });
});


describe("handleRestore", () => {
  test(" nothing in storage", () => {
    mockGet.mockReturnValue(null);

    const gen = handleRestore();

    expect(gen.next().value).toEqual(put(restoreFinished()));
    expect(gen.next().done).toBe(true);
  });

  test(" corrupt JSON ", () => {
    mockGet.mockReturnValue("{bad json");

    const gen = handleRestore();

    const effect = gen.next().value; 

    expect(mockRemove).toHaveBeenCalledWith("session_user");
    expect(effect).toEqual(put(loginError("corrupt")));
    expect(gen.next().done).toBe(true);
  });

  test("missing expiresAt", () => {
    mockGet.mockReturnValue(JSON.stringify({ username: "john" }));

    const gen = handleRestore();

    const effect=gen.next().value; 

    expect(mockRemove).toHaveBeenCalledWith("session_user");
    expect(effect).toEqual(
      put(loginError("Invalid Error"))
    );
    expect(gen.next().done).toBe(true);
  });

  test(" expired session → remove + loginError", () => {
    mockGet.mockReturnValue(
      JSON.stringify({
        username: "john",
        expiresAt: Date.now() - 10000,
      })
    );

    const gen = handleRestore();

    const effect=gen.next().value;

    expect(mockRemove).toHaveBeenCalledWith("session_user");
    expect(effect).toEqual(
      put(loginError("Session expired"))
    );
    expect(gen.next().done).toBe(true);
  });

  test("valid session and then login success", () => {
    const user = {
      username: "john",
      expiresAt: Date.now() + 999999,
    };

    mockGet.mockReturnValue(JSON.stringify(user));

    const gen = handleRestore();

    const effect=gen.next().value; 
    expect(effect).toEqual(put(loginSuccess(user)));
    expect(gen.next().done).toBe(true);
  });
  // test.only("Error in try Block",()=>{
  //    mockGet.mockReturnValue(null);
  //    const gen=handleRestore();
  //    gen.next();
  //    expect(mockRemove).toHaveBeenCalledWith("session_user")
  // })
 });


describe("handleLogout", () => {
  test("clears session storage", () => {
    const gen = handleLogout();

    gen.next();

    expect(mockRemove).toHaveBeenCalledWith("session_user");
    expect(gen.next().done).toBe(true);
  });
});


