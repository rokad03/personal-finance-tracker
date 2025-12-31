import { call, put, takeLatest } from 'redux-saga/effects';
import { loginRequest,loginError,loginSuccess, restoreSession,logout, restoreFinished } from '../slice/loginSlice';
import { type SagaIterator } from 'redux-saga';
import { fetchUsersApi } from '../api/fetchusers';
import { userAuthorisation } from '../api/userAuthorisation';



export function* handleLogin(action:ReturnType<typeof loginRequest>): SagaIterator {
    
    const {username,password}=action.payload;
    try {
        const response:any= yield call(fetchUsersApi)
        console.log("Response",response.users);
        const users=response.users;
        console.log(users)
        const foundUser=users.find((u:any)=>u.username===username && u.password===password)
        console.log(foundUser)
        if(!foundUser){
            yield put(loginError("User not found"))
            return;
        }
        const authres=yield call(userAuthorisation,{username,password})
        console.log(authres);
        const expiresAt=Date.now()+1000*30*60;
        console.log(expiresAt);
        const finalUser={
            ...foundUser,
            token:authres.token,
            expiresAt
        }
        sessionStorage.setItem('session_user',JSON.stringify(finalUser))
        yield put(loginSuccess(finalUser))
    }
    catch (err:any) {
      yield put(loginError(err.message))
    }
}

export function* handleRestore(){
    console.log("Testing")
    try{
    const user=sessionStorage.getItem('session_user');
    if(!user) {yield put(restoreFinished()); return;}
    let u;
    try{
    u=JSON.parse(user);
    }
    catch{
        sessionStorage.removeItem("session_user");
         yield put(loginError("corrupt"));
        return;
    }
     console.log(u.expiresAt);
     console.log(Date.now());
    if ( !u?.expiresAt) {
      sessionStorage.removeItem("session_user");
       yield put(loginError("Invalid Error"));
      return;
    }
    
    if(Date.now()>Number(u.expiresAt)){
       sessionStorage.removeItem("session_user");
       yield put(loginError("Session expired"))
        return;
    }
     
     yield put(loginSuccess(JSON.parse(user)))
     
    
}
catch(err){
    sessionStorage.removeItem("session_user");
    console.log("Error Restore Failed",err)
}
}


export function* handleLogout(){
    sessionStorage.removeItem('session_user');
}

export default function* authSaga(){
    console.log("test")
    yield takeLatest(loginRequest.type,handleLogin);
    yield takeLatest(restoreSession.type,handleRestore);
    yield takeLatest(logout.type,handleLogout);
}