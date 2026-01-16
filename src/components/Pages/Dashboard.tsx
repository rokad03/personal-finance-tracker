import {
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../hooks";
import { manageRecursiveTransactions } from "../slice/transactionSlice";
import { useEffect } from "react";
import TopCategoryTable from "./CategoryTable";

function Dashboard() {
  const dispatch = useAppDispatch();

  //Calculate the recursive Transactions for dashboard
  useEffect(() => {
    dispatch(manageRecursiveTransactions());
  }, [dispatch]);
 

  //Get the user data from redux store
  const user=useAppSelector(state=>state.auth.users)

  //Get the transactions and recursive transactions from Redux Store
  const transactions = useAppSelector(
    (state) => state.transaction.list
  );

  const recursiveList = useAppSelector(
    (state) => state.transaction.recursiveList
  );

  //Filter the non recurring transactions
  const nonRecurring = transactions.filter((t) => !t.recurring);

  //Complete array of recursive and non recursive transactions 
  const completeArray = [...nonRecurring, ...recursiveList];
  const now = Date.now(); 

  //Effective transactions till now.
  const effectiveTransactions = completeArray.filter(
    (t) => t.date && new Date(t.date).getTime() <= now
  );

  let Income = 0;
  let Expense = 0;

  //Create the object for the top3 Income and expense category wise
  const incomeMap: Record<string, number> = {};
  const expenseMap: Record<string, number> = {};

  //Calculating the income and expense till Date..
  for (const t of effectiveTransactions) {
    const amt = Number(t.amount);

    if (t.type === "Income") {
      Income += amt;
      incomeMap[t.category] =
        (incomeMap[t.category] || 0) + amt;
    } else {
      Expense += amt;
      expenseMap[t.category] =
        (expenseMap[t.category] || 0) + amt;
    }
  }

  
  
  //Sort the top3 items based on amount
  const toTop3 = (map: Record<string, number>) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));

  const top3Income = toTop3(incomeMap);
  const top3Expense = toTop3(expenseMap);

  return (
    <>
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', width: '100%', margin: '15px' }}
      >
        Welcome {user?.username}
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

        <Card sx={{ bgcolor: (Income - Expense >= 0) ? "#daebdcff" : "#ffebee" }}>
          <CardContent>
            <Typography variant="subtitle1">Current Balance</Typography>
            <Typography variant="h5" color={(Income - Expense >= 0) ? "success.main" : "error.main"}>
              {Income - Expense}
            </Typography>
          </CardContent>
        </Card>

      </Grid>


      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TopCategoryTable
            title="Top 3 Expenses"
            data={top3Expense}
            emptyText="No expense data found"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TopCategoryTable
            title="Top 3 Incomes"
            data={top3Income}
            emptyText="No income data found"
          />
        </Grid>
      </Grid>

    </>

  )
}

export default Dashboard;