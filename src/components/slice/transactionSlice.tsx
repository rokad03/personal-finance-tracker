import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Total, Transaction } from "../../Types/types";


interface TxState {
  list: Transaction[];
  totalItems:Total;
}
const addDays=(dateStr:string,days:number)=>{
  const [y,m,d]=dateStr.split("-").map(Number);
  const dt=new Date(y,m-1,d+days)
  return dt.toISOString().slice(0,10)
}

const todayStr=()=>new Date().toISOString().slice(0,10);
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
      const today=todayStr();
      
      state.list.forEach((tx)=>{
        console.log(tx.count)
        if(!tx.recurring){
            return;
        }
        const due=addDays(tx.date,30);
        if(today>=due){
         tx.count+=1
         if(tx.type==="Expense"){
          state.totalItems.Expense+=Number(tx.amount);
         }
         else{
          state.totalItems.Income+=Number(tx.amount);
         }
         tx.date=due
        }
      })
    
    }
 }
})
export const {addTransaction,deleteTransaction,editTransaction,total,clearTransaction,sortTransaction,manageCounter}=transactions.actions;
export default transactions.reducer;

