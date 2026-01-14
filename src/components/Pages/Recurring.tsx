import { useEffect, useMemo } from "react";
import { Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../hooks";
import { manageRecursiveTransactions } from "../slice/transactionSlice";

const paginationModel = { page: 0, pageSize: 5 };

export default function Recurring() {
  const dispatch = useAppDispatch();
  const recursiveList = useAppSelector(
    (state) => state.transaction.recursiveList
  );

  useEffect(() => {
    dispatch(manageRecursiveTransactions());
  }, [dispatch]);

  //Table columns

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No",
        flex: 0.4,
        sortable: false,
        filterable: false,
        renderCell: (params) =>
          params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
      },
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        valueGetter: (_value, row) => row.date.slice(0, 10),
      },
      {
        field: "type",
        headerName: "Type",
        flex: 1,
        sortable: false,
      },
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
      },
      {
        field: "interval",
        headerName: "Interval",
        flex: 1,
        sortable: false,
      },
    ],
    []
  );

  /* ---------- UI ---------- */

  return (
    <>
      <Typography align="center" variant="h4" sx={{ m: 6 }}>
        Recurring Transactions
      </Typography>

      <Paper sx={{ height: 400, width: "90%", mx: "auto" }}>
        <DataGrid
          rows={recursiveList}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}
