import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Alert,
  InputLabel
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addTransaction } from "../slice/transactionSlice";
import TransactionList from "./TransactionList";
import { useNavigate } from "react-router-dom";

import { Type, Values } from "../../Types/types"
import { useAppSelector } from "../hooks";


export default function Transaction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [values, setValues] = useState<Values>({
    id: "",
    amount: "",
    type: "" as Type ,
    date: "",
    category: "",
    recurring: false,
    count: 1,
    expiryDate:"",
    interval:""
  });
  const user = sessionStorage.getItem("session_user")
  
 const isValid = useMemo(() => {
  
  const basicFieldsValid = 
    values.amount.trim() !== "" &&
    values.category.trim() !== "" &&
    values.date.trim() !== "" &&
    values.type.trim() !== "";

  const recurringFieldsValid = values.recurring 
    ? (values.expiryDate !== "" && values.interval !== "") 
    : true;

  return basicFieldsValid && recurringFieldsValid;
}, [values]);

   
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);
  const Income = useAppSelector((state) => state.transaction.totalItems.Income);
  const Expense = useAppSelector((state) => state.transaction.totalItems.Expense);
  
  function handleTransaction() {

    if (!isValid) return;
    console.log(Income,Expense,values.type)
    if(Income<=Expense+Number(values.amount) && values.type==="Expense") {setShowError(true);return}
    setShowError(false);
    dispatch(addTransaction({
      id: uuid(),
      amount: values.amount,
      type: values.type,
      date: values.date,
      recurring: values.recurring,
      category: values.category,
      count: values.count,
      expiryDate:values.expiryDate,
      interval:values.interval
    }))
    setValues({
      id: uuid(),
      amount: "",
      type: "" as Type,
      date: "",
      recurring: false,
      count: 1,
      category: "" as Type,
      expiryDate:"",
      interval:""
    })
  }
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          mx: "auto",
          p: 3,
          borderRadius: 3,
        }}
      >
        {(showError) && <Alert severity="error"><h4>Transaction should not be added as Income is less than or Equal to Expense</h4></Alert>}
        <Typography variant="h6" gutterBottom>
          Add Transaction
        </Typography>

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
            {(values.recurring)&&(
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
            <Button
              variant="contained"
              data-testid="Btn"
              fullWidth
              size="large"
              onClick={handleTransaction}
              sx={{ mt: 1 }}
              disabled={!isValid}
            >
              Save Transaction
            </Button>
          </Stack>
        </Box>
      </Paper>
      <TransactionList></TransactionList>

    </>
  );
}
