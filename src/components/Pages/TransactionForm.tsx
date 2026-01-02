import { Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, InputLabel, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Transaction, Type, Values } from "../../Types/types";
import { v4 as uuid } from "uuid";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addTransaction, editTransaction } from "../slice/transactionSlice";
type TransactionType = {
    onClose: () => void;
    tx?: Transaction;
}
export default function TransactionForm({ onClose, tx }: TransactionType) {
    console.log(tx);
    const dispatch = useAppDispatch();
    const [showError, setShowError] = useState(false);
    const [values, setValues] = useState<Values>({
        id: tx?.id || "",
        amount: tx?.amount.toString() || "",
        type: tx?.type || "" as Type,
        date: tx?.date || "",
        category: tx?.category || "",
        recurring: tx?.recurring || false,
        count: tx?.count || 1,
        expiryDate: tx?.expiryDate === "None" ? "" : (tx?.expiryDate || ""),
        interval: tx?.interval || ""
    });
    const isEdited = useMemo(() => {
        if (!tx) return true;
        const currentExpiry = values.expiryDate === "" ? "None" : values.expiryDate;
        const currentInterval = values.interval || "";
        const txInterval = tx.interval || "";

        return (
            values.amount !== tx.amount.toString() ||
            values.type !== tx.type ||
            values.date !== tx.date ||
            values.category !== tx.category ||
            values.recurring !== tx.recurring ||
            values.count !== tx.count ||
            currentExpiry !== tx.expiryDate ||
            currentInterval !== txInterval
        );
    }, [values, tx]);

    const isValid = useMemo(() => {
        const basicFieldsValid =
            values.amount.trim() !== "" &&
            values.category.trim() !== "" &&
            values.date.trim() !== "" &&
            values.type.trim() !== "";

        const recurringFieldsValid = values.recurring
            ? (values.expiryDate !== "" && values.interval !== "")
            : true;


        return basicFieldsValid && recurringFieldsValid && isEdited;
    }, [values, isEdited]);

    console.log("isvlaid Value", isValid);


    const Income = useAppSelector((state) => state.transaction.totalItems.Income);
    const Expense = useAppSelector((state) => state.transaction.totalItems.Expense);

    function handleTransaction() {
        if (!isValid) return;
        console.log(Income, Expense, values.type)
        if (Income <= Expense + Number(values.amount) && values.type === "Expense") { setShowError(true); return }
        setShowError(false);
        console.log("Tx value", tx);
        if (tx) {
            dispatch(editTransaction({
                id: values.id,
                amount: values.amount,
                type: values.type,
                date: values.date,
                recurring: values.recurring,
                count: values.count,
                category: values.category,
                expiryDate: values.expiryDate === "" ? "None" : values.expiryDate,
                interval: values.interval
            }));
        }
        else {
            console.log("Add called");
            dispatch(addTransaction({
                id: uuid(),
                amount: values.amount,
                type: values.type,
                date: values.date,
                recurring: values.recurring,
                category: values.category,
                count: values.count,
                expiryDate: values.expiryDate === "" ? "None" : values.expiryDate,
                interval: values.interval
            }))
        }
        setValues({
            id: uuid(),
            amount: "",
            type: "" as Type,
            date: "",
            recurring: false,
            count: 1,
            category: "" as Type,
            expiryDate: "",
            interval: ""
        })
        onClose();
    }
    return (
        <>

            <Dialog
                open
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle sx={{ pb: 1 }}>
                    {tx ? "Edit Transaction" : "Add Transaction"}
                </DialogTitle>


                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {showError && (
                            <Alert severity="error">
                                Transaction should not be added as Income is less than or Equal to Expense
                            </Alert>
                        )}

                        <Box component="form">
                            <Stack spacing={2}>
                                <TextField
                                    label="Amount"
                                    slotProps={{
                                        htmlInput: {
                                            "data-testid": "amount",
                                        },
                                    }}
                                    type="number"
                                    fullWidth
                                    value={values.amount}
                                    onChange={(e) =>
                                        setValues({ ...values, amount: e.target.value })
                                    }
                                    required
                                />
                                <TextField
                                    select
                                    label="Type"
                                    slotProps={{
                                        htmlInput: {
                                            "data-testid": "Type",
                                        },
                                    }}
                                    fullWidth
                                    value={values.type}
                                    onChange={(e) =>
                                        setValues({ ...values, type: e.target.value as Type })
                                    }
                                    required
                                >
                                    <MenuItem value="Income">Income</MenuItem>
                                    <MenuItem value="Expense">Expense</MenuItem>
                                </TextField>
                                <TextField
                                    label="Category"
                                    slotProps={{
                                        htmlInput: {
                                            "data-testid": "Category",
                                        },
                                    }}

                                    type="text"
                                    fullWidth
                                    value={values.category}
                                    onChange={(e) =>
                                        setValues({ ...values, category: e.target.value })
                                    }
                                    required
                                />

                                <TextField
                                    type="date"
                                    slotProps={{
                                        htmlInput: {
                                            "data-testid": "date",
                                        },
                                    }}
                                    fullWidth
                                    value={values.date}
                                    onChange={(e) =>
                                        setValues({ ...values, date: e.target.value })
                                    }
                                    required
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.recurring}
                                            onChange={(e) => setValues({ ...values, recurring: e.target.checked })}
                                        />
                                    }
                                    label="Mark as Recurring"

                                />
                                {(values.recurring) && (
                                    <>
                                        <TextField
                                            select
                                            label="Type"
                                            slotProps={{
                                                htmlInput: {
                                                    "data-testid": "Recurring-type",
                                                },
                                            }}
                                            fullWidth
                                            value={values.interval}
                                            onChange={(e) =>
                                                setValues({ ...values, interval: e.target.value as Type })
                                            }
                                            required
                                        >
                                            <MenuItem value="Daily">Daily</MenuItem>
                                            <MenuItem value="Monthly">Monthly</MenuItem>
                                            <MenuItem value="Yearly">Yearly</MenuItem>
                                        </TextField>
                                        <InputLabel>Transaction Expiry Date</InputLabel>
                                        <TextField
                                            type="date"
                                            slotProps={{
                                                htmlInput: {
                                                    "data-testid": "expiryDate",
                                                },
                                            }}
                                            fullWidth
                                            value={values.expiryDate}
                                            onChange={(e) =>
                                                setValues({ ...values, expiryDate: e.target.value })
                                            }
                                            required
                                        />
                                    </>
                                )
                                }
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>


                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleTransaction}
                        variant="contained"
                        disabled={!isValid}
                    >
                        {tx ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    )
}
