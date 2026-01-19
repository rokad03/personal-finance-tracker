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
import { clearTransaction } from "../slice/transactionSlice";

//Constants 
const loginAPI = "https://dummyjson.com/auth/login";
const refreshAPI = "https://dummyjson.com/auth/refresh";
const ACCESS_TOKEN_LIFETIME = 1000*30*60; // 30 min
const REFRESH_TOKEN_LIFETIME = 1000*30*60; 
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



/**Dynamic API calling function*/
function* apiPost<T>(url: string, body: unknown): SagaIterator<T> {
  const res: Response = yield call(fetch, url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Request failed");
  return yield call([res, "json"]);
}


/**Login Saga handling the login Request from login form */
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



function* refreshAccessToken(user: UserRes): SagaIterator<UserRes> {
  

  const refresh: AuthResponse = yield call(apiPost, refreshAPI, {
    refreshToken: user.refreshToken,
  });
  // console.log(refresh);

  const updatedUser: UserRes = {  
    ...user,
    accessToken: refresh.accessToken,
    refreshToken: refresh.refreshToken,
    expiresAt: Date.now() + REFRESH_TOKEN_LIFETIME,
  };

  // console.log("UpdatedUSer",updatedUser);
  saveSession(updatedUser);
  return updatedUser;
}


/**Refresh Saga used when restoring the session */
function* handleRestore(): SagaIterator {
  const user = loadSession();

  //  No session
  if (!user) {
    yield put(restoreFinished());
    return;
  }

  //  accessToken OR expiresAt missing
  if (!user.accessToken || !user.expiresAt) {
    clearSession();
    yield put(loginError("Session expired — login again"));
    yield put(restoreFinished());
    return;
  }

  //  access token still valid and comparing date
  if (isAccessTokenValid(user)) {
    yield put(loginSuccess(user));
    yield put(restoreFinished());
    return;
  }

  //  access token expired BUT refreshToken missing
  if (!user.refreshToken) {
    clearSession();
    yield put(logout());
    yield put(loginError("Session expired — login again"));
    yield put(restoreFinished());
    return;
  }

  //access token is expired and refresh token is still valid
  try {
    const refreshedUser: UserRes = yield call(refreshAccessToken, user);
    yield put(loginSuccess(refreshedUser));
  } catch {
    clearSession();
    yield put(loginError("Session expired — login again"));
  }

  yield put(restoreFinished());
}
function* handleLogout() {
  sessionStorage.removeItem("session_user");
  sessionStorage.removeItem("transaction");
  yield put(clearTransaction());
}


/**Root Saga from where all actions dispatched*/
export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(restoreSession.type, handleRestore);
  yield takeLatest(logout.type, handleLogout);
}
