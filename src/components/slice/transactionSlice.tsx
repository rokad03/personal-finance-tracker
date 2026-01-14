import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Total, Transaction } from "../../Types/types";
import { v4 as uuid } from "uuid";

interface TxState {
  list: Transaction[];
   recursiveList:Transaction[]
   totalItems:Total;
}

const addDays = (d: string, n: number) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const saved = sessionStorage.getItem("transaction");
// const resSaved=sessionStorage.getItem("recursive-transaction")
// const savedTotalAmount=sessionStorage.getItem("totalSavedAmount")
const initialState: TxState = {
  list: saved?JSON.parse(saved):[],
  recursiveList:  [],
  totalItems: { Income: 0, Expense: 0, tAmount: 0, top3Income: [], top3Expense: [] },
};
export const transactions=createSlice({
 name:"transactons",
 initialState,
 reducers:{
    addTransaction:(state,action:PayloadAction<Transaction>)=>{
      state.list.unshift(action.payload);
      // sessionStorage.setItem("transaction",JSON.stringify(state.list))
    },
    deleteTransaction:(state,action:PayloadAction<string>)=>{
     state.list=state.list.filter(t=>t.id!==action.payload)
    //  sessionStorage.setItem("transaction",JSON.stringify(state.list))
    },
    editTransaction:(state,action:PayloadAction<Transaction>)=>{
     state.list=state.list.map(t=>t.id===action.payload.id?action.payload:t)
    //  sessionStorage.setItem("transaction",JSON.stringify(state.list))
    },
    // total:(state,action:PayloadAction<Total>)=>{
    //  state.totalItems=action.payload
    // //  sessionStorage.setItem("totalSavedAmount",JSON.stringify(state.totalItems))
    // },
    clearTransaction:(state)=>{
     state.list=[];
    //  sessionStorage.removeItem("transaction")   
    },
    
   manageRecursiveTransactions: (state) => {

  const today = new Date().toISOString().slice(0, 10);

  const expandTx = (tx: Transaction): Transaction[] => {
    if (!tx.recurring || !tx.interval || !tx.expiryDate) return [];

    const start = tx.date.slice(0, 10); //YYYY-MM-DD

    const expiry=tx.expiryDate.slice(0, 10);;
  

    const results: Transaction[] = [];

    let current = start;

    while (current <= today && current <= expiry) {
      results.push({
        ...tx,
        id: uuid(),
        date: current,
      });

      switch ((tx.interval).toLowerCase()) {
        case "daily":
          current = addDays(current, 1);
          break;
        case "monthly": {
          const d = new Date(current);
          d.setMonth(d.getMonth() + 1);
          current = d.toISOString().slice(0, 10);
          break;
        }
        case "yearly": {
          const d = new Date(current);
          d.setFullYear(d.getFullYear() + 1);
          current = d.toISOString().slice(0, 10);
          break;
        }
      }
    }

    return results;
  };

  state.recursiveList = state.list.flatMap(expandTx)
  // sessionStorage.setItem(
  //   "recursive-transaction",
  //   JSON.stringify(state.recursiveList)
  // );
}

 }
})
export const {addTransaction,deleteTransaction,editTransaction,clearTransaction,manageRecursiveTransactions}=transactions.actions;
export default transactions.reducer;

