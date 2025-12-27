import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Stack
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { editTransaction, Type } from "../slice/transactionSlice";
import Recurring from "./Recurring";
import { cachedDataVersionTag } from "node:v8";

export default function EditTransactionDialog({ tx, onClose }: any) {
    const dispatch = useDispatch();

    const [values, setValues] = useState({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        date: tx.date,
        recurring:tx.recurring,
        count:tx.count,
        category:tx.category
    });
    console.log(values);
    const submit = () => {
        dispatch(editTransaction({
            id:values.id,
            amount: values.amount,
            type:values.type,
            date:values.date,
            recurring:values.recurring,
            count:values.count,
            category:values.category
        }));
        onClose();
    };

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>Edit Transaction</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Amount"
                        type="number"
                        value={values.amount}
                        onChange={e => setValues({ ...values, amount: e.target.value })}
                    />
                    <TextField
                        select
                        label="Category"
                        fullWidth
                        value={values.type}
                        onChange={(e) =>
                            setValues({ ...values, type: e.target.value as Type })
                        }
                    >
                        <MenuItem value="shopping">Shopping</MenuItem>
                        <MenuItem value="rent">Rent</MenuItem>
                        <MenuItem value="fees">Fees</MenuItem>
                        <MenuItem value="sip">SIP</MenuItem>
                    </TextField>

                    <TextField
                        type="date"
                        fullWidth
                        value={values.date}
                        onChange={e => setValues({ ...values, date: e.target.value })}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={submit}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
