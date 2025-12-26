import {
  Card,
  CardContent,
  Grid,
  Typography,

} from "@mui/material";
import styles from './Dashboard.module.css'
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


function Dashboard() {
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
  return (
    <>
      <Navbar></Navbar>
      <h1 className={styles.h1}>Welcome {u.username} </h1>
      <Grid container spacing={2}>
        <Card sx={{ bgcolor: "#daebdcff" }}>
          <CardContent>
            <Typography variant="subtitle1">Total Income</Typography>
            <Typography variant="h5" color="success.main">
              {/* ₹{totalIncome.toLocaleString()} */}
              10000
            </Typography>
          </CardContent>
        </Card>



        <Card sx={{ bgcolor: "#ffebee" }}>
          <CardContent>
            <Typography variant="subtitle1">Total Expenses</Typography>
            <Typography variant="h5" color="error.main">
              {/* ₹{totalExpenses.toLocaleString()} */}
              10000
            </Typography>
          </CardContent>
        </Card>



        <Card sx={{ bgcolor: "#e3f2fd" }}>
          <CardContent>
            <Typography variant="subtitle1">Current Balance</Typography>
          </CardContent>
        </Card>

      </Grid>
    </>

  )
}

export default Dashboard;