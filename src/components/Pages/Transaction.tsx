import { useEffect, useState } from "react";

import {
  Box,
  Button,
} from "@mui/material";

import TransactionForm from "./TransactionForm";
import PaginationTable from "./PaginationTable";
import { useAppDispatch, useAppSelector } from "../store/store";
import { manageRecursiveTransactions,clearTransaction } from "../slice/transactionSlice";


export default function Transaction() {
  const dispatch = useAppDispatch();
  const list = useAppSelector(state => state.transaction.list);

  useEffect(() => {
    dispatch(manageRecursiveTransactions());
  }, [list, dispatch]);

  

  const [display, setDisplay] = useState(false);

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
