import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Button, Stack } from '@mui/material';
import { deleteTransaction, total } from '../slice/transactionSlice';
import EditTransactionDialog from './EditTransaction';
import TransactionForm from './TransactionForm';


const paginationModel = { page: 0, pageSize: 5 };

function PaginationTable() {
    const dispatch = useAppDispatch();
    const transactions = useAppSelector((state) => state.transaction.list)
    const [selectedId, setSelectedId] = useState<null | any>(null);
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.5,sortable: false, },
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'expiryDate', headerName: 'Expiry Date', flex: 1 },
        { field: 'type', headerName: 'Type', flex: 1 , sortable: false,},
        { field: 'category', headerName: 'Category', flex: 1,sortable: false, },
        { field: 'amount', headerName: 'Amount', flex: 1 },
        { field: 'recurring', headerName: 'Recurring', flex: 1,sortable: false, },
         { field: 'interval', headerName: 'Interval', flex: 1,sortable: false, },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            renderCell: (params) => {

                const tx = params.row;

                return (
                    <Stack direction="row" spacing={1}>
                        <Button
                            size="small"
                            onClick={() => { console.log(`Editing: ${tx}`); setSelectedId(tx) }}
                        >
                            Edit
                        </Button>
                        <Button
                            size="small"
                            color="error"
                            onClick={() => dispatch(deleteTransaction(tx.id))}
                        >
                            Delete
                        </Button>
                    </Stack>
                );
            }
        }

    ];
    const tAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
    const Income = transactions.filter((t) => t.type === "Income").reduce((sum, i) => sum + Number(i.amount), 0)
    const Expense = transactions.filter((t) => t.type === "Expense").reduce((sum, i) => sum + Number(i.amount), 0)
    const categoryExpenseSorting: Record<string, number> = {}
    const categoryIncomeSorting:Record<string,number>={}
    transactions.forEach((t) => {
        if (t.type === "Expense") {
            categoryExpenseSorting[t.category] = (categoryExpenseSorting[t.category] || 0) + Number(t.amount);
        }
        else{
            categoryIncomeSorting[t.category]=(categoryIncomeSorting[t.category] || 0) + Number(t.amount);
        }
    })
    const top3Expense = Object.entries(categoryExpenseSorting).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([category, amount]) => ({ category, amount }))
    const top3Income= Object.entries(categoryIncomeSorting).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([category, amount]) => ({ category, amount }))
   
    useEffect(() => {
        dispatch(total({
            tAmount,
            Income,
            Expense,
            top3Expense,
            top3Income
        }))
    }, [tAmount, Income, Expense, dispatch, top3Expense,top3Income])

    console.log(transactions);
    return (
        <>
            <Paper sx={{ height: 400, width: '90%', margin: '0 auto' }}>
                <DataGrid
                    rows={transactions}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    sx={{
                        border: 0
                    }}
                    disableRowSelectionOnClick
                />
            </Paper>
            {/* {
                selectedId && (<EditTransactionDialog tx={selectedId} onClose={() => setSelectedId(null)} />)
            } */}
            {
                selectedId && (<TransactionForm tx={selectedId} onClose={() => setSelectedId(null)} />)
            }
            
        </>
    );
}

export default PaginationTable;
