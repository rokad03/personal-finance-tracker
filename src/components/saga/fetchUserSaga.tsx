import { call, put, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";

import {
  loginRequest,
  loginError,
  loginSuccess,
  restoreSession,
  restoreFinished,
  logout,
} from "../slice/loginSlice";
import { AuthResponse, UserRes } from "../../Types/types";


export function* apiPost<T>(url: string, body: unknown): SagaIterator<T> {
  const res: Response = yield call(fetch, url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Request failed");

  const data: T = yield call([res, "json"]); // res.json()
  return data;
}



export function* handleLogin(action: ReturnType<typeof loginRequest>
): SagaIterator {
  const { username, password } = action.payload;

  try {
    const data: AuthResponse = yield call(
      apiPost<AuthResponse>,
      "https://dummyjson.com/auth/login",
      { username, password, expiresInMins: 30 }
    );
    // console.log(data);

    const expiresAt = Date.now() + 1000; // 30 mins

    const user: UserRes = {
      ...data,
    //   accessToken: data.token,
      expiresAt,
    };

    sessionStorage.setItem("session_user", JSON.stringify(user));

    yield put(loginSuccess(user));
  } catch {
    yield put(loginError("Invalid username or password"));
  }
}

export function* handleRestore(): SagaIterator {
    // console.log("Handle restore calling");
  try {
    const stored = sessionStorage.getItem("session_user");
    // console.log(stored);
    if (!stored) {
      yield put(restoreFinished());
      return;
    }

    let user: UserRes = JSON.parse(stored);

    // console.log(Date.now(),user.expiresAt)
    if (Date.now() < user.expiresAt) {
      
      yield put(loginSuccess(user));
      return;
    }

    //using refresh token
    try {
      const refresh: AuthResponse = yield call(
        apiPost<AuthResponse>,
        "https://dummyjson.com/auth/refresh",
        {
          refreshToken: user.refreshToken,
          expiresInMins: 30,
        }
      );
    //   console.log(user);
    //   console.log("refresh",refresh)
      user = {
        ...user,
        accessToken: refresh.authToken,
        refreshToken:refresh.refreshToken,
        expiresAt: Date.now() + 1000,
      };
    //   console.log(user);
      sessionStorage.setItem("session_user", JSON.stringify(user));

      yield put(loginSuccess(user));
    } catch {
        // console.log("Executing catch")
      sessionStorage.removeItem("session_user");
      yield put(loginError("Session expired — login again"));
    }
  } catch {
    sessionStorage.removeItem("session_user");
    yield put(loginError("Restore failed"));
  }
}



// export function* handleLogout() {
//   sessionStorage.removeItem("session_user");
// }




export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(restoreSession.type, handleRestore);
//      yield takeLatest(logout.type, handleLogout);
}
