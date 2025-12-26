import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Type= "shopping"| "rent"| "fees" | "sip";
export type Transaction = {
  id: string;
  type: Type;
  amount: string;
  date: string;
};
export type Total={
  tAmount:number;
  Shopping:number;
  Rent:number;
  Fees:number;
  SIP:number;
}
interface TxState {
  list: Transaction[];
  totalItems:Total;
}
const saved = sessionStorage.getItem("transaction");
const savedTotalAmount=sessionStorage.getItem("totalSavedAmount")
const initialState: TxState = {
  list: saved?JSON.parse(saved):[],
  totalItems: savedTotalAmount?JSON.parse(savedTotalAmount):0
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
    },
    total:(state,action:PayloadAction<Total>)=>{
     state.totalItems=action.payload
     sessionStorage.setItem("totalSavedAmount",JSON.stringify(state.totalItems))
    }
 }
})
export const {addTransaction,deleteTransaction,editTransaction,total}=transactions.actions;
export default transactions.reducer;

