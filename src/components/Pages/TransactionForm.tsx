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
import { useMemo, useState } from "react";
import { Transaction, MethodType, Values } from "../../Types/types";
import { v4 as uuid } from "uuid";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addTransaction, editTransaction } from "../slice/transactionSlice";

type TransactionType = {
  onClose: () => void;
  tx?: Transaction;
};

export default function TransactionForm({ onClose, tx }: TransactionType) {
  const dispatch = useAppDispatch();
  const [showError, setShowError] = useState(false);

  const Income = useAppSelector(
    (state) => state.transaction.totalItems.Income
  );
  const Expense = useAppSelector(
    (state) => state.transaction.totalItems.Expense
  );

  //Initial Values

  const initialValues: Values = {
    id: tx?.id ?? "",
    amount: tx?.amount ?? "",
    type: tx?.type ?? ("" as MethodType),
    date: tx?.date ?? "",
    category: tx?.category ?? "",
    recurring: tx?.recurring ?? false,
    count: tx?.count ?? 1,
    expiryDate: tx?.expiryDate === "None" ? "" : tx?.expiryDate ?? "",
    interval: tx?.interval ?? "",
  };

  const [values, setValues] = useState<Values>(initialValues);


  const amountNumber = Number(values.amount);

  const isAmountInvalid =
    values.amount !== "" && amountNumber <= 0;

  const isExpiryInvalid =
    values.recurring &&
    values.expiryDate !== "" &&
    values.date !== "" &&
    (values.expiryDate ?? "") <= values.date;

  const isEdited = useMemo(() => {
    if (!tx) return true;
    return JSON.stringify(initialValues) !== JSON.stringify(values);
  }, [values, tx]);

  const isValid = useMemo(() => {
    const basicValid =
      amountNumber > 0 &&
      values.category.trim() !== "" &&
      values.date.trim() !== "" &&
      values.type.trim() !== "";

    const recurringValid = values.recurring
      ? values.expiryDate !== "" &&
        values.interval !== "" &&
        !isExpiryInvalid
      : true;

    return basicValid && recurringValid && isEdited;
  }, [values, amountNumber, isExpiryInvalid, isEdited]);

  //Helpers

  const updateValue = <K extends keyof Values>(
    key: K,
    value: Values[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = (): Transaction => ({
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

  //Submit

  function handleTransaction() {
    if (!isValid) return;

    if (
      values.type === "Expense" &&
      Income <= Expense + amountNumber
    ) {
      setShowError(true);
      return;
    }

    setShowError(false);

    const payload = buildPayload();
    tx ? dispatch(editTransaction(payload)) : dispatch(addTransaction(payload));

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
              slotProps={{ htmlInput: { min: 1 } }}
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
              label="Money Type"
              fullWidth
              value={values.type}
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
              fullWidth
              value={values.category}
              onChange={(e) => updateValue("category", e.target.value)}
              required
            />

            <TextField
              type="date"
              fullWidth
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
