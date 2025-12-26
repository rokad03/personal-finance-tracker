import { useEffect, useState } from "react";
import {v4 as uuid} from "uuid";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addTransaction, Type } from "../slice/transactionSlice";
import TransactionList from "./TransactionList";
import { useNavigate } from "react-router-dom";
type Values={
  id:string,
  amount:string,
  type:Type,
  date:string
}

export default function Transaction() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [values, setValues] = useState<Values>({
    id:uuid(),
    amount: "",
    type: "shopping" as Type  ,
    date: "",
  });
  const user = sessionStorage.getItem("session_user")
    useEffect(() => {
      if (!user) {
        navigate("/login", { replace: true });
      }
    }, [user,navigate]);
  function handleTransaction(){
    dispatch(addTransaction({
      id:uuid(),
      amount:values.amount,
      type:values.type,
      date:values.date
    }))
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
      <Typography variant="h6" gutterBottom>
        Add Transaction
      </Typography>

      <Box component="form">
        <Stack spacing={2}>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={values.amount}
            onChange={(e) =>
              setValues({ ...values, amount: e.target.value })
            }
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
            onChange={(e) =>
              setValues({ ...values, date: e.target.value })
            }

          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleTransaction}
            sx={{ mt: 1 }}
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
