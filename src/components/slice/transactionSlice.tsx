import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Total, Transaction } from "../../Types/types";
import { v4 as uuid } from "uuid";

interface TxState {
  list: Transaction[];
  recursiveList: Transaction[]
  totalItems: Total;
}
/**
 *  Adding the days to current day, based on transaction interval
 */
const addDays = (d: string, n: number) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

/**
 * Calculating total Income and expense
 */
function calculateTotals(list: Transaction[]) {
  return list.reduce(
    (acc, t) => {
      const amt = Number(t.amount);
      if (t.type === "Income") acc.Income += amt;
      if (t.type === "Expense") acc.Expense += amt;
      return acc;
    },
    { Income: 0, Expense: 0 }
  );
}

const saved = sessionStorage.getItem("transaction");

/**
 * Initial state of transaction
 */
const initialState: TxState = {
  list: saved ? JSON.parse(saved) : [],
  recursiveList: [],
  totalItems: { Income: 0, Expense: 0 },
};

export const transactions = createSlice({
  name: "transactons",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.list.unshift(action.payload);
      const { Income, Expense } = calculateTotals(state.list);
      state.totalItems.Income = Income;
      state.totalItems.Expense = Expense;
      // sessionStorage.setItem("transaction",JSON.stringify(state.list))
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(t => t.id !== action.payload)
      const { Income, Expense } = calculateTotals(state.list);
      state.totalItems.Income = Income;
      state.totalItems.Expense = Expense;
      //  sessionStorage.setItem("transaction",JSON.stringify(state.list))
    },
    editTransaction: (state, action: PayloadAction<Transaction>) => {
      state.list = state.list.map(t => t.id === action.payload.id ? action.payload : t)
      const { Income, Expense } = calculateTotals(state.list);
      state.totalItems.Income = Income;
      state.totalItems.Expense = Expense;
      //  sessionStorage.setItem("transaction",JSON.stringify(state.list))
    },
    total: (state, action: PayloadAction<Total>) => {
      state.totalItems = action.payload
      //  sessionStorage.setItem("totalSavedAmount",JSON.stringify(state.totalItems))
    },
    clearTransaction: (state) => {
      state.list = [];
      const { Income, Expense } = calculateTotals(state.list);
      state.totalItems.Income = Income;
      state.totalItems.Expense = Expense;
      //  sessionStorage.removeItem("transaction")   
    },

    /**
     * Manage the recursive transactions along with dashboard
     */
    manageRecursiveTransactions: (state) => {

      const today = new Date().toISOString().slice(0, 10);

      const expandTransactions = (tx: Transaction): Transaction[] => {
        if (!tx.recurring || !tx.interval || !tx.expiryDate) return [];

        const transactionDate = tx.date.slice(0, 10); //YYYY-MM-DD

        const transactionExpiryDate = tx.expiryDate.slice(0, 10);;


        const results: Transaction[] = [];

        let dateIterator = transactionDate;

        while (dateIterator <= today && dateIterator <= transactionExpiryDate) {
          results.push({
            ...tx,
            id: uuid(),
            date: dateIterator,
          });

          switch ((tx.interval).toLowerCase()) {
            case "daily":
              dateIterator = addDays(dateIterator, 1);
              break;
            case "monthly": {
              const d = new Date(dateIterator);
              d.setMonth(d.getMonth() + 1);
              dateIterator = d.toISOString().slice(0, 10);
              break;
            }
            case "yearly": {
              const d = new Date(dateIterator);
              d.setFullYear(d.getFullYear() + 1);
              dateIterator = d.toISOString().slice(0, 10);
              break;
            }
          }
        }

        return results;
      };

      state.recursiveList = state.list.flatMap(expandTransactions)
      // sessionStorage.setItem(
      //   "recursive-transaction",
      //   JSON.stringify(state.recursiveList)
      // );
    }

  }
})
export const { addTransaction, deleteTransaction, editTransaction, clearTransaction, manageRecursiveTransactions, total } = transactions.actions;
export default transactions.reducer;

