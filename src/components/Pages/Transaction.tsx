import { useEffect, useState } from "react";

import {
  Box,
  Button,
} from "@mui/material";


import { useNavigate } from "react-router-dom";

import TransactionForm from "./TransactionForm";
import PaginationTable from "./PaginationTable";
import { useAppDispatch, useAppSelector } from "../hooks";
import { manageCounter,clearTransaction } from "../slice/transactionSlice";


export default function Transaction() {
  const dispatch = useAppDispatch();
  const list = useAppSelector(state => state.transaction.list);

  useEffect(() => {
    dispatch(manageCounter());
  }, [list, dispatch]);

  const navigate = useNavigate();

  const [display, setDisplay] = useState(false);

  const user = sessionStorage.getItem("session_user")

  //If user not present, navigate to login
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 4, mb: 3 }}>
        <Button onClick={()=>dispatch(clearTransaction())} variant="contained">
          Clear all transactions
        </Button>
        <Button onClick={() => setDisplay(true)} variant="contained">
          Add the transaction
        </Button>

      </Box>

      {display && <TransactionForm onClose={() => setDisplay(false)} />}

      <PaginationTable />


    </>
  );
}
