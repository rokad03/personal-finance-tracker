import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Type= "shopping"| "rent"| "fees" | "sip";
export type Transaction = {
  id: string;
  type: Type;
  amount: string;
  date: string;
};
interface TxState {
  list: Transaction[];
}
const saved = sessionStorage.getItem("transaction");
const initialState: TxState = {
  list: saved?JSON.parse(saved):[],
};
export const transactions=createSlice({
 name:"transactons",
 initialState,
 reducers:{
    addTransaction:(state,action:PayloadAction<Transaction>)=>{
      state.list.push(action.payload);
      sessionStorage.setItem("transaction",JSON.stringify(state.list))
    },
    deleteTransaction:(state,action:PayloadAction<string>)=>{
     state.list=state.list.filter(t=>t.id!==action.payload)
     sessionStorage.setItem("transaction",JSON.stringify(state.list))
    },
    editTransaction:(state,action:PayloadAction<Transaction>)=>{
     state.list=state.list.map(t=>t.id===action.payload.id?action.payload:t)
     sessionStorage.setItem("transaction",JSON.stringify(state.list))
    }
 }
})
export const {addTransaction,deleteTransaction,editTransaction}=transactions.actions;
export default transactions.reducer;

