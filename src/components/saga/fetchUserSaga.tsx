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

const loginAPI = "https://dummyjson.com/auth/login";
const refreshAPI = "https://dummyjson.com/auth/refresh";
const ACCESS_TOKEN_LIFETIME = 1000*60*30; // 30 min
const REFRESH_TOKEN_LIFETIME = 1000 * 60 * 30; // frontend assumption
const SESSION_KEY = "session_user";
function saveSession(user: UserRes) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function loadSession(): UserRes | null {
  const stored = sessionStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

function isAccessTokenValid(user: UserRes) {
  return Date.now() < user.expiresAt;
}


/* ---------- API ---------- */

function* apiPost<T>(url: string, body: unknown): SagaIterator<T> {
  const res: Response = yield call(fetch, url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Request failed");
  return yield call([res, "json"]);
}

/* ---------- LOGIN ---------- */

function* handleLogin(
  action: ReturnType<typeof loginRequest>
): SagaIterator {
  try {
    const data: AuthResponse = yield call(apiPost, loginAPI, {
      ...action.payload, //username, password
      expiresInMins: 30,
    });

    const user: UserRes = {
      ...data,
      expiresAt: Date.now() + ACCESS_TOKEN_LIFETIME,
    };

    saveSession(user);
    yield put(loginSuccess(user));
  } catch {
    yield put(loginError("Invalid Credentials"));
  }
}

/* ---------- REFRESH ---------- */

function* refreshAccessToken(user: UserRes): SagaIterator<UserRes> {
  console.log(user.refreshToken)
  const refresh: AuthResponse = yield call(apiPost, refreshAPI, {
    refreshToken: user.refreshToken,
    expiresInMins: 30,
  });

  const updatedUser: UserRes = {
    ...user,
    accessToken: refresh.authToken,
    refreshToken: refresh.refreshToken,
    expiresAt: Date.now() + REFRESH_TOKEN_LIFETIME,
  };

  saveSession(updatedUser);
  return updatedUser;
}

/* ---------- RESTORE ---------- */

function* handleRestore(): SagaIterator {
  const user = loadSession();

  // 1️⃣ No session
  if (!user) {
    yield put(restoreFinished());
    return;
  }

  // 2️⃣ accessToken OR expiresAt missing
  if (!user.accessToken || !user.expiresAt) {
    clearSession();
    yield put(loginError("Session expired — login again"));
    yield put(restoreFinished());
    return;
  }

  // 3️⃣ access token still valid
  if (isAccessTokenValid(user)) {
    yield put(loginSuccess(user));
    yield put(restoreFinished());
    return;
  }

  // 4️⃣ access token expired BUT refreshToken missing
  if (!user.refreshToken) {
    clearSession();
    yield put(loginError("Session expired — login again"));
    yield put(restoreFinished());
    return;
  }

  // 5️⃣ try refresh
  try {
    const refreshedUser: UserRes = yield call(refreshAccessToken, user);
    yield put(loginSuccess(refreshedUser));
  } catch {
    clearSession();
    yield put(loginError("Session expired — login again"));
  }

  yield put(restoreFinished());
}
function* handleLogout(): SagaIterator {
  sessionStorage.removeItem("session_user");
  sessionStorage.removeItem("transaction");
}



/* ---------- ROOT ---------- */

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(restoreSession.type, handleRestore);
  yield takeLatest(logout.type, handleLogout);
}
