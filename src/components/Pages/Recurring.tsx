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
import { clearTransaction, sortTransaction } from '../slice/transactionSlice';
function Recurring() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transaction.list);
  const recursiveTransactions = transactions.filter((t) => t.recurring === true)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  console.log(transactions)
  const pageItems = recursiveTransactions.slice(firstIndex, lastIndex)

  console.log(pageItems)
  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  function calculateNextTransaction(dateInput: string | Date): string {
  const date = new Date(dateInput);
  date.setDate(date.getDate() + 30);
  console.log(date)
  const lastDate=date.toISOString().split('T')[0];
  return lastDate;
}


  
  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
        <Stack direction="row" justifyContent="space-between"
          alignItems="center">
          <Typography variant="h6" sx={{ p: 2 }}>
            Transactions
          </Typography>
          <Button onClick={() => dispatch(sortTransaction())}>
            Sort By Amount
          </Button>

        </Stack>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell >Amount (₹)</TableCell>
              <TableCell>No. of times Transactions occured</TableCell>
              <TableCell align='right'>Next Auto Pay</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {pageItems.map((tx, i) => (
              <TableRow key={i}>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell >
                  {tx.amount}
                </TableCell>
                {/* <TableCell>
                  {compareDates(tx.date,tx.count)}
                </TableCell> */}
                <TableCell align="right">
                  {tx.recurring
                    ? calculateNextTransaction(tx.date)
                    : "a"}

                </TableCell>

              </TableRow>
            ))}

            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </TableContainer>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>Prev</Button>
        <Typography>{currentPage} of {totalPages}</Typography>
        <Button onClick={() => setCurrentPage(next => next + 1)} disabled={currentPage === totalPages}>Next</Button>
      </Stack>


    </>
  )
}

export default Recurring