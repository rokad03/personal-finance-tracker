
import reducer, {
  addTransaction,
  deleteTransaction,
  editTransaction,
  total,
  clearTransaction,
  sortTransaction,
  manageCounter,
  Transaction,
  Total,
} from "../components/slice/transactionSlice"



describe("Test the transaction Slice",()=>{
    const initialState={
        list:[] as Transaction[],
        totalItems: {tAmount:0}as any
    }
     const tx: Transaction = {
      id: "1",
      type: "Income",
      amount: "100",
      date: "2025-01-01",
      recurring: false,
      count: 0,
      category: "Salary"
    };
    test("Testing the initial State",()=>{
        expect(reducer(undefined,{type:""})).toEqual(initialState)
    })
    test("Add the Transaction",()=>{
        const state=reducer(initialState,addTransaction(tx))
        expect(state.list.length).toBe(1);
        expect(state.list[0]).toBe(tx);
    })
    test("Edit the transaction",()=>{
        const state=reducer({...initialState,list:[{id:"1",amount:"100"} as any]},editTransaction({id:"1",amount:"200"} as any))
        expect(state.list[0].amount).toBe("200")
    })

    test("Delete the transaction",()=>{
        const state=reducer({...initialState,list:[{id:"1"} as any]},deleteTransaction("1"))
        expect(state.list.length).toBe(0);
    })

    test("Test total",()=>{
        const state=reducer({...initialState,list:[{id:"1",amount:"100"} as any]},total({tAmount:100,Income:200,Expense:200,top5:[]}))
        expect(state.totalItems.tAmount).toBe(100)
        expect(state.totalItems.Income).toBe(200)
    })
    test("Sorting Transaction",()=>{
        const unsortedList=[
            {id:"1",amount:"200"},
            {id:"2",amount:"400"}
        ]
        const state=reducer({...initialState,list:unsortedList as any},sortTransaction())
        expect(state.list.map((t)=>t.id)).toEqual(["2","1"])
    })
    test("Clear the transaction",()=>{
        const state=reducer({...initialState,list:[{id:"1",amount:"200"} as any]},clearTransaction())
        expect(state.list).toEqual([]);
    })

    test("Test the counter",()=>{
        const state=reducer({...initialState,list:[{count:0} as any]},manageCounter());
        expect(state.list[0].count).toBe(0);
    })
})