import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { Total, Transaction } from "../../Types/types";
import { v4 as uuid } from "uuid";

interface TxState {
  list: Transaction[];
  recursiveList:Transaction[]
  totalItems:Total;
}
const dateOnly = (d: string) => d.slice(0, 10);

const addDays = (d: string, n: number) => {

  const [y,m,dd] = dateOnly(d).split("-").map(Number);
  console.log(y,m,dd);
  console.log(y,m,dd+n);
  console.log(new Date(y, m , dd + n).toISOString().slice(0,10))
  return new Date(y, m-1 , dd + n+1).toISOString().slice(0,10);
};


const saved = sessionStorage.getItem("transaction");
const resSaved=sessionStorage.getItem("recursive-transaction")
const savedTotalAmount=sessionStorage.getItem("totalSavedAmount")
const initialState: TxState = {
  list: saved?JSON.parse(saved):[],
  recursiveList:  resSaved?JSON.parse(resSaved):[],
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

  // const today = new Date().toISOString().slice(0,10);
  const today = new Date().toISOString().slice(0, 16);
  
    // console.log("MAnagerCouner")
  console.log("Recurring Transaction",state.list.filter((rt,i)=>{
    return rt.recurring===true; 
  }))

  const rList=state.list.filter((rt,i)=>{
    return(
       rt.recurring===true && rt.date<=today
    )
  })
  console.log("rlist is ",rList);
  
  
  rList.forEach(tx => {

    
    // let next = dateOnly(tx.date);
    let nextDate=tx.date;
    // console.log("Next Date",nextDate)
 
    // if ( dateOnly(tx.expiryDate??"") < today) {
    //   return;
    // }

    // let days = 0;
    // switch((tx.interval || "").toLowerCase()){
    //   case "daily": days = 1; break;
    //   case "monthly": days = 30; break;
    //   case "yearly": days = 365; break;
    //   default: return;
    // }

    // while (true) {
      
    
       const due = addDays(nextDate, 1);
       console.log("Due date",due,dateOnly(today))
       console.log(due<=today)

      //  if (due > today) break;

      
       state.recursiveList.unshift({
        ...tx,
        date:due,
        id:uuid()
       })
       console.log(state.recursiveList);
       tx.date=due;
     
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
    //  }
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

