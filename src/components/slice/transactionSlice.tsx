import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Total, Transaction } from "../../Types/types";
import { v4 as uuid } from "uuid";

interface TxState {
  list: Transaction[];
  totalItems:Total;
}
const dateOnly = (d: string) => d.slice(0, 10);

const addDays = (d: string, n: number) => {
  const [y,m,dd] = dateOnly(d).split("-").map(Number);
  return new Date(y, m-1, dd + n).toISOString().slice(0,10);
};


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
    },
   manageCounter:(state)=>{

  const today = new Date().toISOString().slice(0,10);

  state.list.forEach(tx => {

    if (!tx.recurring) return;

    let next = dateOnly(tx.date);

 
    if ( dateOnly(tx.expiryDate??"") < today) {
      return;
    }

    let days = 0;
    switch((tx.interval || "").toLowerCase()){
      case "daily": days = 1; break;
      case "monthly": days = 30; break;
      case "yearly": days = 365; break;
      default: return;
    }

    // while (true) {
      
    //   const due = addDays(next, days);
    //   console.log("Due date",due,"today",today)

    //   if (due > today) break;

     
    //   state.list.unshift({
    //     ...tx,
    //     // id: uuid(),
    //     date: due,
    //     // recurring:false,
    //     // interval:"",
    //     // expiryDate:"None"
    //   });

   
    //   next = due;
    //   tx.count += 1;
    //   console.log("Count",tx.count);
     
    //   if (due >= dateOnly(tx.expiryDate??"")) break;
    // }
  });

  
  state.list = state.list.filter(tx =>
    !tx.recurring || tx.expiryDate === "None" || dateOnly(tx.expiryDate??"") >= today
  );

  sessionStorage.setItem("transaction", JSON.stringify(state.list));
}
 }
})
export const {addTransaction,deleteTransaction,editTransaction,total,clearTransaction,sortTransaction,manageCounter}=transactions.actions;
export default transactions.reducer;

