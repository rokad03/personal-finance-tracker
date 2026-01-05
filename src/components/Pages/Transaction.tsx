import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
} from "@mui/material";


import { useNavigate } from "react-router-dom";


import TransactionForm from "./TransactionForm";
import PaginationTable from "./PaginationTable";


export default function Transaction() {
 
  const navigate = useNavigate();
 
  const [display,setDisplay]=useState(false);

  const user = sessionStorage.getItem("session_user")

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'right', m: 4 , mb:3 }}>
        <Button onClick={()=>setDisplay(true)} variant="contained">
          Add the transaction
        </Button>
      </Box>
      {display&&<TransactionForm onClose={() => setDisplay(false)}/>}
     
      <PaginationTable/>
    </>
  );
}
