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
import styles from './Dashboard.module.css'
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../hooks";

function Dashboard() {
  const {totalItems}=useAppSelector((state)=>state.transaction)
  const {tAmount,...totalCategory}=totalItems;
  const CategoryArray=Object.entries(totalCategory);
  const navigate = useNavigate();
  const user = sessionStorage.getItem("session_user")
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user,navigate]);
  if(!user){
    return (<h1>User session expires</h1>)
  }
  const u = JSON.parse(user ? user : "");
  const totalIncome=10000;
  console.log(totalItems.tAmount)
  return (
    <>
      <Navbar></Navbar>
      <h1 className={styles.h1}>Welcome {u.username} </h1>
      <Grid container spacing={2} justifyContent="center" alignContent="center">
        <Card sx={{ bgcolor: "#daebdcff" }}>
          <CardContent>
            <Typography variant="subtitle1">Total Income</Typography>
            <Typography variant="h5" color="success.main">
             {totalIncome}
            </Typography>
          </CardContent>
        </Card>



        <Card sx={{ bgcolor: "#ffebee" }}>
          <CardContent>
            <Typography variant="subtitle1">Total Expenses</Typography>
            <Typography variant="h5" color="error.main">
              
              {totalItems.tAmount?0:totalItems.tAmount}
            </Typography>
          </CardContent>
        </Card>



        <Card sx={{ bgcolor: "#e3f2fd" }}>
          <CardContent>
            <Typography variant="subtitle1">Current Balance</Typography>
            <Typography variant="h5" color="error.main">
              {totalIncome-totalItems.tAmount}
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
          {CategoryArray.map((tx,i) => (
            <TableRow key={i}>
              <TableCell>{tx[0]}</TableCell>
              <TableCell align="right">
                {tx[1]}
              </TableCell>
            </TableRow>
          ))}

          {CategoryArray.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No Stats found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </>

  )
}

export default Dashboard;