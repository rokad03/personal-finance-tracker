import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Stack,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { editTransaction } from "../slice/transactionSlice";
import { Transaction, Type } from "../../Types/types";
type EditTransactionType={
    tx:Transaction,
    onClose:()=>void;
}
export default function EditTransactionDialog({ tx, onClose }: EditTransactionType) {
    const dispatch = useDispatch();
  
    const [values, setValues] = useState({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        date: tx.date,
        recurring: tx.recurring,
        count: tx.count,
        category: tx.category
    });
      const isValid =
        values.amount.trim() !== "" &&
        values.category.trim() !== "" &&
        values.date.trim() !== "" &&
        values.type.trim() !== "";
   
    const submit = () => {
        if(!isValid){
            return;
        }
        dispatch(editTransaction({
            id: values.id,
            amount: values.amount,
            type: values.type,
            date: values.date,
            recurring: values.recurring,
            count: values.count,
            category: values.category
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
                        slotProps={{
                            htmlInput: {
                                "data-testid": "EditedAmount"
                            }
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
                        label="Categpry"
                        type="text"
                        slotProps={{
                            htmlInput: {
                                "data-testid": "EditedCategory"
                            }
                        }}
                        fullWidth
                        value={values.category}
                        onChange={(e) =>
                            setValues({ ...values, category: e.target.value })
                        }
                        required
                    />
                    <TextField
                        select
                        label="Type"
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
                        type="date"
                        fullWidth
                        value={values.date}
                        slotProps={{
                            htmlInput: {
                                "data-testid": "EditedDate"
                            }
                        }}
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
                        label="Marks as Recurring"
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
