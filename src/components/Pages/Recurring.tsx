import React, { useEffect } from 'react'
import {
  Paper,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { manageCounter } from '../slice/transactionSlice';
const paginationModel = { page: 0, pageSize: 5 };

function Recurring() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, recursiveList } = useAppSelector(s => s.transaction);


  const completeArray = [...recursiveList];

  const user = sessionStorage.getItem("session_user")

  //If user not present navigate to login
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  //Calculating total transactions to display
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
        return dateValue.slice(0, 10);
      }
    },
    { field: 'type', headerName: 'Type', flex: 1, sortable: false, },
    { field: 'category', headerName: 'Category', flex: 1, sortable: false, },
    { field: 'amount', headerName: 'Amount', flex: 1 },
    { field: 'interval', headerName: 'Interval', flex: 1, sortable: false, },
  ];

  return (
    <>
      <Typography align="center" variant='h4' sx={{ m: 6 }}>Recurring Transactions</Typography>
      <Paper sx={{ height: 400, width: '90%', margin: '0 auto' }}>

        <DataGrid
          rows={completeArray}
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