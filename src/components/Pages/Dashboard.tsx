import {
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../hooks";

function Dashboard() {
  const { totalItems } = useAppSelector((state) => state.transaction)
  const { Income = 0, Expense = 0, top5 } = totalItems;
  const navigate = useNavigate();
  const user = sessionStorage.getItem("session_user")
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }

  }, [user, navigate]);

  if (!user) {
    return (<h1>User session expires</h1>)
  }
  const u = JSON.parse(user ? user : "");

  return (
    <>
      <Navbar></Navbar>
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', width: '100%', margin:'15px'}}
      >
        Welcome {u.username}
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignContent="center">
        <Card sx={{ bgcolor: "#daebdcff" }}>
          <CardContent>
            <Typography variant="subtitle1">Total Income</Typography>
            <Typography variant="h5" color="success.main">
              {Income}
            </Typography>
          </CardContent>
        </Card>



        <Card sx={{ bgcolor: "#ffebee" }}>
          <CardContent>
            <Typography variant="subtitle1">Total Expenses</Typography>
            <Typography variant="h5" color="error.main">
              {Expense}
            </Typography>
          </CardContent>
        </Card>



        <Card sx={{ bgcolor: (Income-Expense>=0)?"#daebdcff":"#ffebee" }}>
          <CardContent>
            <Typography variant="subtitle1">Current Balance</Typography>
            <Typography variant="h5" color="error.main">
              {Income - Expense}
            </Typography>
          </CardContent>
        </Card>

      </Grid>

      <TableContainer component={Paper} sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Total Amount By Category
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount (₹)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!top5 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Stats found
                </TableCell>
              </TableRow>
            )}
            {top5 && top5.map((tx, i)=> (
              <TableRow key={i}>
                <TableCell>{tx.category}</TableCell>
                <TableCell align="right">
                  {tx.amount}
                </TableCell>
              </TableRow>
            ))}


          </TableBody>
        </Table>
      </TableContainer>
    </>

  )
}

export default Dashboard;