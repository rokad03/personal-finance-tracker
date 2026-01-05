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


function* apiPost(url: string, body: any): SagaIterator {
  const res: Response = yield call(fetch, url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Request failed");

  return yield call([res, "json"]);   // res.json()
}



export function* handleLogin(action: ReturnType<typeof loginRequest>): SagaIterator {
  const { username, password } = action.payload;

  try {
    const data: any = yield call(apiPost,
      "https://dummyjson.com/auth/login",
      { username, password, expiresInMins: 30 }
    );

    const expiresAt = Date.now() + 1000 * 60 * 30;

    const user = {
      ...data,
      accessToken: data.token,
      refreshToken: data.refreshToken,
      expiresAt,
    };

    sessionStorage.setItem("session_user", JSON.stringify(user));

    yield put(loginSuccess(user));
  } catch (err) {
    yield put(loginError("Invalid username or password"));
  }
}




export function* handleRestore(): SagaIterator {
  try {
    const str = sessionStorage.getItem("session_user");

    if (!str) {
      yield put(restoreFinished());
      return;
    }

    let user = JSON.parse(str);

    if (Date.now() < user.expiresAt) {
      yield put(loginSuccess(user));
      return;
    }


    try {
      const refresh: any = yield call(apiPost,
        "https://dummyjson.com/auth/refresh",
        { refreshToken: user.refreshToken, expiresInMins: 30 }
      );

      user.accessToken = refresh.token;
      user.expiresAt = Date.now() + 1000 * 60 * 30;

      sessionStorage.setItem("session_user", JSON.stringify(user));

      yield put(loginSuccess(user));
    } catch {
      sessionStorage.removeItem("session_user");
      yield put(loginError("Session expired — login again"));
    }
  } catch {
    sessionStorage.removeItem("session_user");
    yield put(loginError("Restore failed"));
  }
}




export function* handleLogout() {
  sessionStorage.removeItem("session_user");
}



export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(restoreSession.type, handleRestore);
  yield takeLatest(logout.type, handleLogout);
}
