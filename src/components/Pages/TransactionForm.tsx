import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Transaction, MethodType, Values } from "../../Types/types";
import { v4 as uuid } from "uuid";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addTransaction, editTransaction, total } from "../slice/transactionSlice";

type TransactionType = {
    onClose: () => void;
    tx?: Transaction;
};

export default function TransactionForm({ onClose, tx }: TransactionType) {
    const {
        id = "",
        amount = "",
        type = "" as MethodType,
        date = "",
        category = "",
        recurring = false,
        count = 1,
        expiryDate = "",
        interval = "",
    } = tx ?? {};

    const dispatch = useAppDispatch();
    const [showError, setShowError] = useState(false);


    //Getting Income and Expense from Store
    const Income = useAppSelector(
        (state) => state.transaction.totalItems.Income
    );
    const Expense = useAppSelector(
        (state) => state.transaction.totalItems.Expense
    );

    console.log(Income,Expense)
    const initialValues: Values = {
        id,
        amount,
        type,
        date,
        category,
        recurring,
        count,
        expiryDate: expiryDate === "None" ? "" : expiryDate,
        interval,
    };
    let initalEditedAmount: string
    if (tx) {
        initalEditedAmount = initialValues.amount;
    }
    const [values, setValues] = useState<Values>(initialValues);


    const amountNumber = Number(values.amount);

    //checking amount is greater then 0 and non negative
    const isAmountInvalid =
        values.amount !== "" && amountNumber <= 0;

    //checking the expiry date is valid  
    const isExpiryInvalid =
        values.recurring &&
        values.expiryDate !== "" &&
        values.date !== "" &&
        (values.expiryDate ?? "") <= values.date;

    //Verify the data is edited or not
    const isEdited = !tx ? true : JSON.stringify(initialValues) !== JSON.stringify(values);

    //Basic validation before adding transaction
    const basicValid =
        amountNumber > 0 &&
        values.category.trim() !== "" &&
        values.date.trim() !== "" &&
        values.type.trim() !== "";

    //recurring transactions validation
    const recurringValid = values.recurring
        ? values.expiryDate !== "" &&
        values.interval !== "" &&
        !isExpiryInvalid
        : true;

    const isValid = basicValid && recurringValid && isEdited;

    //Helpers

    const updateValue = <K extends keyof Values>(
        key: K,
        value: Values[K]
    ) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const Payload = (): Transaction => ({
        id: values.id || uuid(),
        amount: values.amount,
        type: values.type,
        date: values.date,
        recurring: values.recurring,
        count: values.count,
        category: values.category,
        expiryDate: values.expiryDate === "" ? "None" : values.expiryDate,
        interval: values.interval,
    });
   

    //handling the transaction
    function handleTransaction() {
        if (!isValid) return;

        if (values.type === "Expense" && Income < Expense + (amountNumber - ((tx) ? Number(initalEditedAmount) : 0))) {
            console.log(Income, Expense, amountNumber);
            setShowError(true);
            return;
        }

        setShowError(false);

        const payload = Payload();

        //If transaction is present, then dispatch edit action othersiwe dispatch add action
        tx ? dispatch(editTransaction(payload)) : dispatch(addTransaction(payload));

        //After adding or editing, again set the state to inital state
        setValues({
            id: uuid(),
            amount: "",
            type: "" as MethodType,
            date: "",
            recurring: false,
            count: 1,
            category: "",
            expiryDate: "",
            interval: "",
        });

        onClose();
    }



    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {tx ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>
                    {showError && (
                        <Alert severity="error">
                            Expense cannot exceed income
                        </Alert>
                    )}

                    <Stack spacing={2}>
                        <TextField
                            label="Amount"
                            type="number"
                            fullWidth
                            slotProps={{
                                htmlInput: {
                                    'data-testid': 'amount',
                                    slotProps: {
                                        htmlInput: {
                                            min: 1,
                                        },
                                    },
                                },
                            }}
                            value={values.amount}
                            error={isAmountInvalid}
                            helperText={
                                isAmountInvalid
                                    ? "Amount must be greater than 0"
                                    : ""
                            }
                            onChange={(e) => updateValue("amount", e.target.value)}
                            required
                        />

                        <TextField
                            select
                            label="MoneyType"
                            fullWidth
                            value={values.type}
                            slotProps={{
                                htmlInput: {
                                    "data-testid": "Type",
                                },
                            }}
                            onChange={(e) =>
                                updateValue("type", e.target.value as MethodType)
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
                            fullWidth
                            value={values.category}
                            onChange={(e) => updateValue("category", e.target.value)}
                            required
                        />

                        <TextField
                            type="date"
                            fullWidth
                            slotProps={{
                                htmlInput: {
                                    "data-testid": "date",
                                },
                            }}
                            value={values.date}
                            onChange={(e) => updateValue("date", e.target.value)}
                            required
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={values.recurring}
                                    onChange={(e) =>
                                        setValues((prev) => ({
                                            ...prev,
                                            recurring: e.target.checked,
                                            expiryDate: "",
                                            interval: "",
                                        }))
                                    }
                                />
                            }
                            label="Mark as Recurring"
                        />

                        {values.recurring && (
                            <>
                                <TextField
                                    select
                                    label="Interval"
                                    slotProps={{
                                        htmlInput: {
                                            "data-testid": "Recurring-type",
                                        },
                                    }}
                                    fullWidth
                                    value={values.interval}
                                    onChange={(e) =>
                                        updateValue("interval", e.target.value as MethodType)
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
                                    fullWidth
                                    value={values.expiryDate}
                                    error={isExpiryInvalid}
                                    slotProps={{
                                        htmlInput: {
                                            "data-testid": "expiryDate",
                                        },
                                    }}
                                    helperText={
                                        isExpiryInvalid
                                            ? "Expiry date must be greater than transaction date"
                                            : ""
                                    }
                                    onChange={(e) =>
                                        updateValue("expiryDate", e.target.value)
                                    }
                                    required
                                />
                            </>
                        )}
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleTransaction}
                    variant="contained"
                    disabled={!isValid}
                >
                    {tx ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
