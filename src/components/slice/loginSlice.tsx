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
          state.error=undefined;
          state.loading=true;
        },
        loginSuccess:(state,action)=>{
            state.users=action.payload;
            state.loading=false;
        },
        loginError:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        restoreSession:()=>{},
        logout:(state)=>{
            state.users=null;
        },
       
    }           
});
export const {loginRequest,loginSuccess,loginError,restoreSession,logout} = loginSlice.actions;
export default loginSlice.reducer;