import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'

import {
    Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import EditTransactionDialog from './EditTransaction';
import { deleteTransaction } from '../slice/transactionSlice';

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
};


export default function TransactionList() {
  const transactions=useAppSelector((state)=>state.transaction.list)
  const dispatch=useAppDispatch();
  const [selectedId,setSelectedId]=useState<null|any>(null);
  return (
    <>
    <TableContainer component={Paper} sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Transactions
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount (₹)</TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>

        <TableBody>
          {transactions.map((tx,i) => (
            <TableRow key={i}>
              <TableCell>{tx.date}</TableCell>
              <TableCell>{tx.type}</TableCell>
              <TableCell align="right">
                {tx.amount}
              </TableCell>
               <TableCell align="right" >
                  <Button onClick={() => {console.log(`test ${i}`);setSelectedId(tx)}}>
                    Edit
                  </Button>
                  <Button onClick={()=>{dispatch(deleteTransaction(tx.id))}}>Delete</Button>
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
    {
        selectedId&&(<EditTransactionDialog tx={selectedId} onClose={()=>setSelectedId(null)}/>)
    }
    </>
  );
}


