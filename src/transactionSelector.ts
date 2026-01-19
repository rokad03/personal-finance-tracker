import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../src/components/store/store";


/**
 * Base selectors
 */
const selectTransactions = (state: RootState) => state.transaction.list;
const selectRecursive = (state: RootState) => state.transaction.recursiveList;

/**
 * Effective transactions till now
 */
export const selectEffectiveTransactions = createSelector(
  [selectTransactions, selectRecursive],
  (transactions, recursive) => {
    const nonRecurring = transactions.filter(t => !t.recurring);
    const combined = [...nonRecurring, ...recursive];
    const now = Date.now();

    return combined.filter(
      t => t.date && new Date(t.date).getTime() <= now
    );
  }
);

/**
 * Totals (Income & Expense)
 */
export const selectTotals = createSelector(
  [selectEffectiveTransactions],
  (txs) =>
    txs.reduce(
      (acc, t) => {
        const amt = Number(t.amount);
        if (t.type === "Income") acc.Income += amt;
        else acc.Expense += amt;
        return acc;
      },
      { Income: 0, Expense: 0 }
    )
);

/**
 * Category maps
 */
export const selectCategoryMaps = createSelector(
  [selectEffectiveTransactions],
  (txs) => {
    const incomeMap: Record<string, number> = {};
    const expenseMap: Record<string, number> = {};

    txs.forEach(t => {
      const amt = Number(t.amount);
      if (t.type === "Income") {
        incomeMap[t.category] = (incomeMap[t.category] || 0) + amt;
      } else {
        expenseMap[t.category] = (expenseMap[t.category] || 0) + amt;
      }
    });

    return { incomeMap, expenseMap };
  }
);
