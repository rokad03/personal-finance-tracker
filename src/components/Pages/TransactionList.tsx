import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'   
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
import EditTransactionDialog from './EditTransaction';
import { clearTransaction, deleteTransaction, sortTransaction, total } from '../slice/transactionSlice';


export default function TransactionList() {
    const transactions = useAppSelector((state) => state.transaction.list)
    const dispatch = useAppDispatch();
    const [selectedId, setSelectedId] = useState<null | any>(null);
    const tAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
    const Income = transactions.filter((t) => t.type === "Income").reduce((sum, i) => sum + Number(i.amount), 0)
    const Expense= transactions.filter((t) => t.type === "Expense").reduce((sum, i) => sum + Number(i.amount), 0)
    const categorySorting:Record<string,number>={}
    transactions.forEach((t)=>{
        categorySorting[t.category]=(categorySorting[t.category]||0)+Number(t.amount);
        })
    const top3=Object.entries(categorySorting).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([category,amount])=>({category,amount}))

    // useEffect(() => {
    //     dispatch(total({
    //         tAmount,
    //         Income,
    //         Expense,
    //         // top3Income,
    //         // top3Expense
    //     }))
    // }, [tAmount, Income,Expense,dispatch,top3])

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    // console.log(transactions)
    const pageItems = transactions.slice(firstIndex, lastIndex)
  
    // console.log(pageItems)
    const totalPages = Math.ceil(transactions.length / itemsPerPage)
    return (
        <>
            <TableContainer component={Paper} sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
                <Stack direction="row" justifyContent="space-between"
                    alignItems="center">
                    <Typography variant="h6" sx={{ p: 2 }}>
                        Transactions
                    </Typography>
                    <Button onClick={()=>dispatch(sortTransaction())}>
                        Sort By Amount
                    </Button>
                    <Button onClick={()=>{alert("All transactions will be deleted");dispatch(clearTransaction())}}>
                        Clear
                    </Button>

                </Stack>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>TId</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Exprity Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Category</TableCell>
                            
                            <TableCell >Amount (₹)</TableCell>
                            
                            <TableCell align='right'>Recurring</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pageItems.map((tx, i) => (
                            <TableRow key={i}>
                                <TableCell>{i+1}</TableCell>
                                <TableCell>{tx.date}</TableCell>
                                 <TableCell>{tx.expiryDate}</TableCell>
                                <TableCell>{tx.type}</TableCell>
                                <TableCell>{tx.category}</TableCell>
                                <TableCell >
                                    {tx.amount}
                                </TableCell>
                                <TableCell align="right">
                                    {tx.recurring?"True":"False"}
                                </TableCell>
                                <TableCell align="right" >
                                    <Button onClick={() => { console.log(`test ${i}`); setSelectedId(tx) }}>
                                        Edit
                                    </Button>
                                    <Button onClick={() => { dispatch(deleteTransaction(tx.id)) }}>Delete</Button>
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
                <Typography>{currentPage} of {Math.max(1,totalPages)}</Typography>
                <Button onClick={() => setCurrentPage(next => next + 1)} disabled={currentPage ===  totalPages || totalPages===1}>Next</Button>
            </Stack>
            {
                selectedId && (<EditTransactionDialog tx={selectedId} onClose={() => setSelectedId(null)} />)
            }

        </>
    );
}


