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
    // { field: 'expiryDate', headerName: 'Expiry Date', flex: 1 , valueGetter:(value,row)=>{
    //   const dateValue=row.expiryDate;
    //   return dateValue.slice(0,10);
    // }},
    { field: 'type', headerName: 'Type', flex: 1, sortable: false, },
    { field: 'category', headerName: 'Category', flex: 1, sortable: false, },
    { field: 'amount', headerName: 'Amount', flex: 1 },
    { field: 'interval', headerName: 'Interval', flex: 1, sortable: false, },
    // {
    //   field: 'Next_Deducation',
    //   headerName: 'Next Deduction',
    //   flex: 1,
    //   sortable: true,

    //   valueGetter: (value, row) => {
    //     const date = row.date;
    //     const interval = row.interval;

    //     // if (!date || !interval) return "N/A";

    //     let daysToAdd = 0;
    //     switch (interval.toLowerCase()) {
    //       case 'daily': daysToAdd = 2; break;
    //       case 'monthly': daysToAdd = 31; break;
    //       case 'yearly': daysToAdd = 365; break;
    //       default: daysToAdd = 0;
    //     }
    //     return addDays(date, daysToAdd);
    //   },
    // },


  ];

  return (
    <>
    <Typography align="center" variant='h4' sx={{m:6}}>Recurring Transactions</Typography>
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