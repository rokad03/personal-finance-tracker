import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type initial={
    loading:Boolean,
    users:users|null,
    error?:string,
    restoring:boolean
}
type users={
    username:string,
    password:string
}
const initialState:initial = {
    loading:false,
    users:null,
    restoring:true
};  
export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers:{
        loginRequest:(state,action:PayloadAction<{username:string,password:string}>)=>{
          state.loading=true;
        },
        loginSuccess:(state,action)=>{
            state.users=action.payload;
            state.loading=false;
            state.restoring=false;
        },
        loginError:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            state.restoring=false;
        },
        restoreSession:(state)=>{
            state.restoring=true;
        },
        restoreFinished:(state)=>{
            state.restoring=false;
        },
        logout:(state)=>{
            state.users=null;
            state.restoring=false;
        },
       
    }           
});
export const {loginRequest,loginSuccess,loginError,restoreSession,logout,restoreFinished} = loginSlice.actions;
export default loginSlice.reducer;