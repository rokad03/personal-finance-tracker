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
import { manageCounter } from "../slice/transactionSlice";
import { useDispatch } from "react-redux";
import { CategoryListing } from "../../Types/types";

function Dashboard() {
  const dispatch=useDispatch();
  const { totalItems } = useAppSelector((state) => state.transaction)
  const { list, recursiveList } = useAppSelector((s) => s.transaction);

const transactions = [...list, ...recursiveList];

  const { Income = 0, Expense = 0, top3Income,top3Expense } = totalItems;
  const navigate = useNavigate();
  const user = sessionStorage.getItem("session_user")

  useEffect(() => {
    if (!user) {  
      navigate("/login", { replace: true });
    }

  }, [user, navigate]);
    useEffect(()=>{dispatch(manageCounter());
       const id = setInterval(() => {
    dispatch(manageCounter());
  }, 60 * 1000); // 1 min

  return () => clearInterval(id);},[dispatch])

  // if (!user) {
  //   return (<h1>User session expires</h1>)
  // }
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

      
      <Grid container spacing={3} sx={{ p: 3 }}>
         
          <Grid size={{ xs: 12, md: 6 }}  >
            <TableContainer component={Paper} elevation={3}>
              <Typography variant="h6" sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                Top 3 Expenses 
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!top3Expense ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 3 }}>No Stats found</TableCell>
                    </TableRow>
                  ) : (
                    top3Expense.map((tx:CategoryListing, i: number) => (
                      <TableRow key={`exp-${i}`} hover>
                        <TableCell>{tx.category}</TableCell>
                        <TableCell align="right">{tx.amount}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          {/* Top 3 Incomes Table */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TableContainer component={Paper} elevation={3}>
              <Typography variant="h6" sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                Top 3 Incomes
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!top3Income? (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 3 }}>No Stats found</TableCell>
                    </TableRow>
                  ) : (
                    top3Income.map((tx: CategoryListing, i: number) => (
                      <TableRow key={`inc-${i}`} hover>
                        <TableCell>{tx.category}</TableCell>
                        <TableCell align="right">{tx.amount}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        
    </>

  )
}

export default Dashboard;