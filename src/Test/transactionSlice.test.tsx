import reducer, {
  addTransaction,
  deleteTransaction,
  editTransaction,
  total,
  clearTransaction,
  sortTransaction,
  manageCounter,
} from "../components/slice/transactionSlice";
import { Total, Transaction } from "../Types/types";

describe("transaction slice", () => {
  let setSpy: jest.SpyInstance;
  let removeSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    setSpy = jest.spyOn(Storage.prototype, "setItem");
    removeSpy = jest.spyOn(Storage.prototype, "removeItem");
    jest.useFakeTimers(); 
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  const initialState = {
    list: [] as Transaction[],
    totalItems: { tAmount: 0 } as any,
  };

  const tx: Transaction = {
    id: "1",
    type: "Income",
    amount: "100",
    date: "2025-01-01",
    recurring: false,
    count: 0,
    category: "Salary",
  };

  test("initial state", () => {
    expect(reducer(undefined, { type: "" })).toEqual(initialState);
  });

  test("addTransaction", () => {
    const state = reducer(initialState, addTransaction(tx));

    expect(state.list.length).toBe(1);
    expect(state.list[0]).toEqual(tx);

    expect(setSpy).toHaveBeenCalled(); 
  });

  test("editTransaction", () => {
    const state = reducer(
      { ...initialState, list: [{ id: "1", amount: "100" } as any] },
      editTransaction({ id: "1", amount: "200" } as any)
    );

    expect(state.list[0].amount).toBe("200");
    expect(setSpy).toHaveBeenCalled();
  });

  test("deleteTransaction", () => {
    const state = reducer(
      { ...initialState, list: [{ id: "1" } as any] },
      deleteTransaction("1")
    );

    expect(state.list.length).toBe(0);
    expect(setSpy).toHaveBeenCalled();
  });

  test("total updates totalItems", () => {
    const totals: Total = {
      tAmount: 100,
      Income: 200,
      Expense: 100,
      top5: [],
    };

    const state = reducer(initialState, total(totals));

    expect(state.totalItems).toEqual(totals);
    expect(setSpy).toHaveBeenCalled();
  });

  test("sortTransaction sorts amounts desc", () => {
    const list = [
      { id: "1", amount: "200" },
      { id: "2", amount: "400" },
    ] as any;

    const state = reducer(
      { ...initialState, list },
      sortTransaction()
    );

    expect(state.list.map(t => t.id)).toEqual(["2", "1"]);
    expect(setSpy).toHaveBeenCalled();
  });

  test("clearTransaction clears list & removes storage", () => {
    const state = reducer(
      { ...initialState, list: [{ id: "1" } as any] },
      clearTransaction()
    );

    expect(state.list).toEqual([]);
    expect(removeSpy).toHaveBeenCalledWith("transaction");
  });

  test("manageCounter increments when recurring + 30 days passed", () => {
   
    jest.setSystemTime(new Date("2025-02-01"));

    const recurringTx = {
      id: "1",
      type: "Expense",
      amount: "50",
      date: "2024-12-31", 
      recurring: true,
      count: 1,
      category: "Netflix",
    };

    const state = reducer(
      { ...initialState, list: [recurringTx] as any },
      manageCounter()
    );

    expect(state.list[0].count).toBe(2);     
    expect(state.list[0].date).toBe("2025-01-29"); 
  });

  test("manageCounter does NOT increment when not due", () => {
    jest.setSystemTime(new Date("2025-01-10"));

    const tx = {
      id: "1",
      type: "Expense",
      amount: "50",
      date: "2025-01-05",
      recurring: true,
      count: 1,
      category: "Netflix",
    };

    const state = reducer(
      { ...initialState, list: [tx] as any },
      manageCounter()
    );

    expect(state.list[0].count).toBe(1);
  });

  test("manageCounter ignores non-recurring", () => {
    const tx = {
      ...initialState,
      list: [{ recurring: false, count: 5 } as any],
    };

    const state = reducer(tx, manageCounter());

    expect(state.list[0].count).toBe(5);
  });
});
