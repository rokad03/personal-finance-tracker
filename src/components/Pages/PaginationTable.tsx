import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, Button, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks";
import { deleteTransaction, total } from "../slice/transactionSlice";
import TransactionForm from "./TransactionForm";
import { Transaction } from "../../Types/types";

const paginationModel = { page: 0, pageSize: 5 };

export default function PaginationTable() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(
    (state) => state.transaction.list
  );
  const recursiveList = useAppSelector(
    (state) => state.transaction.recursiveList
  );

  const [selectedTrans, setSelectedTrans] =
    useState<Transaction | null>(null);

  const nonRecurring = transactions.filter((t) => !t.recurring);
  const completeArray = [...nonRecurring, ...recursiveList];

  const now = Date.now();

  const effectiveTransactions = completeArray.filter(
    (t) => t.date && new Date(t.date).getTime() <= now
  );

  /* ---------- TOTALS ---------- */

    let tAmount = 0;
    let Income = 0;
    let Expense = 0;

    const incomeMap: Record<string, number> = {};
    const expenseMap: Record<string, number> = {};

    for (const t of effectiveTransactions) {
      const amt = Number(t.amount);
      tAmount += amt;

      if (t.type === "Income") {
        Income += amt;
        incomeMap[t.category] =
          (incomeMap[t.category] || 0) + amt;
      } else {
        Expense += amt;
        expenseMap[t.category] =
          (expenseMap[t.category] || 0) + amt;
      }
    }

    const toTop3 = (map: Record<string, number>) =>
      Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category, amount]) => ({ category, amount }));

    const top3Income=toTop3(incomeMap);
    const top3Expense=toTop3(expenseMap);
   

  /* ---------- EFFECT ---------- */

  useEffect(() => {
    dispatch(
      total({
        tAmount,
        Income,
        Expense,
        top3Income,
        top3Expense,
      })
    );
  }, [dispatch, tAmount, Income, Expense, top3Income, top3Expense]);

  /* ---------- COLUMNS ---------- */

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "SNo",
        headerName: "S.No",
        flex: 0.5,
        renderCell: (params) =>
          params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
      },
      { field: "id", headerName: "ID", flex: 0.5, sortable: false },
      { field: "date", headerName: "Date", flex: 1 },
      { field: "expiryDate", headerName: "Expiry Date", flex: 1 },
      { field: "type", headerName: "Type", flex: 1, sortable: false },
      {
        field: "category",
        headerName: "Category",
        flex: 1,
        sortable: false,
      },
      {
        field: "amount",
        headerName: "Amount",
        flex: 1,
        type: "number",
      },
      {
        field: "recurring",
        headerName: "Recurring",
        flex: 1,
        sortable: false,
      },
      {
        field: "interval",
        headerName: "Interval",
        flex: 1,
        sortable: false,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        sortable: false,
        renderCell: (params) => {
          const tx = params.row as Transaction;
          return (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                onClick={() => setSelectedTrans(tx)}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() =>
                  dispatch(deleteTransaction(tx.id))
                }
              >
                Delete
              </Button>
            </Stack>
          );
        },
      },
    ],
    [dispatch]
  );

  /* ---------- UI ---------- */

  return (
    <>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Paper
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            height: "70vh",
          }}
        >
          <DataGrid
            rows={transactions}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            sx={{ border: 0, minWidth: 600 }}
          />
        </Paper>
      </Box>

      {selectedTrans && (
        <TransactionForm
          tx={selectedTrans}
          onClose={() => setSelectedTrans(null)}
        />
      )}
    </>
  );
}
