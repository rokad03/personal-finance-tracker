import React, { useEffect, useState } from 'react'
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from '../hooks';
import { deleteTransaction, manageCounter, sortTransaction } from '../slice/transactionSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
const paginationModel = { page: 0, pageSize: 5 };

const addDays = (dateStr: string, days: number) => {
  if (!dateStr) return "";


  const [datePart, timePart] = dateStr.split("T");

  const [y, m, d] = datePart.split("-").map(Number);

  // console.log("Same day Date",new Date(y,m-1,d+days));
  // console.log("Next day Date",new Date(y,m-1,d+2*days))
  
  const nextDate = new Date(y, m - 1, d + days);
  // console.log(nextDate);
  const nextDateStr = nextDate.toISOString().slice(0, 10);
  return `${nextDateStr} ${timePart || ""}`;
};




function Recurring() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const transactions = useAppSelector((state) => state.transaction.list);

  const recursiveTransactions = transactions.filter((t) => t.recurring === true)


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  // console.log(transactions)
  const pageItems = recursiveTransactions.slice(firstIndex, lastIndex)

  // console.log(pageItems)
  const totalPages = Math.ceil(recursiveTransactions.length / itemsPerPage)

  const user = sessionStorage.getItem("session_user")
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(manageCounter())
  }, [dispatch])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5, sortable: false, },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      valueGetter: (value, row) => {
        const dateValue = row.date;
        return dateValue.slice(0,10);
      }
    },
    { field: 'expiryDate', headerName: 'Expiry Date', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1, sortable: false, },
    { field: 'category', headerName: 'Category', flex: 1, sortable: false, },
    { field: 'amount', headerName: 'Amount', flex: 1 },
    { field: 'interval', headerName: 'Interval', flex: 1, sortable: false, },
    {
      field: 'Next_Deducation',
      headerName: 'Next Deduction',
      flex: 1,
      sortable: true,

      valueGetter: (value, row) => {
        const date = row.date;
        const interval = row.interval;

        if (!date || !interval) return "N/A";

        let daysToAdd = 0;
        switch (interval.toLowerCase()) {
          case 'daily': daysToAdd = 2; break;
          case 'monthly': daysToAdd = 31; break;
          case 'yearly': daysToAdd = 365; break;
          default: daysToAdd = 0;
        }

        return addDays(date, daysToAdd);
      },
    },


  ];

  return (
    <>
      <Paper sx={{ height: 400, width: '90%', margin: '0 auto' }}>
        <DataGrid
          rows={recursiveTransactions}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{
            border: 0
          }}
          disableRowSelectionOnClick
          
        />
      </Paper>


    </>
  )
}

export default Recurring