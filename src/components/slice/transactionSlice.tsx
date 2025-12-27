import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Type= "Income"|"Expense";
export type Transaction = {
  id: string;
  type: Type;
  amount: string;
  date: string;
  recurring: boolean;
  count:0;
  category:string
};
type CategoryListing={
    category:string;
    amount:number
}
export type Total={
  tAmount:number;
  Income:number;
  Expense:number;
  top5:CategoryListing[]
}
interface TxState {
  list: Transaction[];
  totalItems:Total;
}
const saved = sessionStorage.getItem("transaction");
const savedTotalAmount=sessionStorage.getItem("totalSavedAmount")
const initialState: TxState = {
  list: saved?JSON.parse(saved):[],
  totalItems: savedTotalAmount?JSON.parse(savedTotalAmount):{tAmount:0}
};
export const transactions=createSlice({
 name:"transactons",
 initialState,
 reducers:{
    addTransaction:(state,action:PayloadAction<Transaction>)=>{
      state.list.unshift(action.payload);
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
    },
    clearTransaction:(state)=>{
     state.list=[];
     sessionStorage.removeItem("transaction")   
    },
    sortTransaction:(state)=>{
      state.list=state.list.sort((a,b)=>(Number(b.amount)-Number(a.amount)))
      sessionStorage.setItem("totalSavedAmount",JSON.stringify(state.totalItems))
    }   
 }
})
export const {addTransaction,deleteTransaction,editTransaction,total,clearTransaction,sortTransaction}=transactions.actions;
export default transactions.reducer;

