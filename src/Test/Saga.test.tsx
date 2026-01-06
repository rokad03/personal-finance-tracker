import { all, call, put } from "redux-saga/effects";

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

import { apiPost } from "../components/saga/fetchUserSaga";


const mockSet = jest.spyOn(Storage.prototype, "setItem");
const mockGet = jest.spyOn(Storage.prototype, "getItem");
const mockRemove = jest.spyOn(Storage.prototype, "removeItem");

beforeEach(() => {
  jest.clearAllMocks();
});


describe("rootSaga", () => {
  test("runs authSaga inside all()", () => {
    const gen = rootSaga();

    expect(gen.next().value).toEqual(
      all([authSaga()])
    );

    expect(gen.next().done).toBe(true);
  });
});

describe("handleLogin", () => {

  test("successful login flow", () => {
    const action = loginRequest({ username: "john", password: "123" });

    const gen = handleLogin(action);

  
    expect(gen.next().value).toEqual(
      call(apiPost, "https://dummyjson.com/auth/login", {
        username: "john",
        password: "123",
        expiresInMins: 30,
      })
    );

  
    const apiResult = {
      token: "abc",
      refreshToken: "xyz",
      id: 1,
      username: "nishit",
      email: "nishit@test.com",
    };

    const effect = gen.next(apiResult).value as any;

    
    expect(effect.type).toBe(put(loginSuccess({} as any)).type);

    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith(
      "session_user",
      expect.any(String)
    );

    expect(gen.next().done).toBe(true);
  });


  test("API failure triggers loginError", () => {
    const action = loginRequest({ username: "x", password: "y" });

    const gen = handleLogin(action);

    
    expect(gen.next().value).toEqual(expect.any(Object));

    
    const err = new Error("boom");

    expect(gen.throw!(err).value).toEqual(
      put(loginError("Invalid username or password"))
    );

    expect(gen.next().done).toBe(true);
  });
});




describe("handleRestore", () => {

  test("no session stored → restoreFinished()", () => {
    mockGet.mockReturnValue(null);

    const gen = handleRestore();

    expect(gen.next().value).toEqual(
      put(restoreFinished())
    );

    expect(gen.next().done).toBe(true);
  });


  test("corrupt JSON triggers loginError + remove", () => {
    mockGet.mockReturnValue("bad json");

    const gen = handleRestore();

    
    const effect = gen.next().value;

    expect(mockRemove).toHaveBeenCalledWith("session_user");

    expect(effect).toEqual(
      put(loginError("Restore failed"))
    );

    expect(gen.next().done).toBe(true);
  });

});




describe("handleLogout", () => {
  test("clears session storage", () => {
    const gen = handleLogout();

    gen.next(); 

    expect(mockRemove).toHaveBeenCalledWith("session_user");

    expect(gen.next().done).toBe(true);
  });
});



describe("apiPost Saga", () => {
  const url = "dummyjson.com";
  const body = { username: "test", password: "123" };
  const mockResponseData = { token: "abc-123" };

  test("successfully performs a POST request and parses JSON", () => {
    const gen = apiPost(url, body);

   
    expect(gen.next().value).toEqual(
      call(fetch, url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    );


    const mockRes = {
      ok: true,
      json: () => mockResponseData,
    };

   
    expect(gen.next(mockRes as any).value).toEqual(
      call([mockRes, "json"])
    );

   
    const finalResult = gen.next(mockResponseData);
    expect(finalResult.value).toEqual(mockResponseData);
    expect(finalResult.done).toBe(true);
  });

  test("throws an error if the response is not ok", () => {
    const gen = apiPost(url, body);

    
    gen.next();

   
    const mockRes = { ok: false };

  
    expect(() => {
      gen.next(mockRes as any);
    }).toThrow("Request failed");
  });
});
