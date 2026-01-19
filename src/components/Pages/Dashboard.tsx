import {
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../store/store";
import { manageRecursiveTransactions} from "../slice/transactionSlice";
import { useEffect, useMemo } from "react";
import TopCategoryTable from "./CategoryTable";
import ReactECharts from "echarts-for-react";
import { selectCategoryMaps, selectTotals } from "../../transactionSelector";

function Dashboard() {
  const dispatch = useAppDispatch();



  //Calculate the recursive Transactions for dashboard
  useEffect(() => {
    dispatch(manageRecursiveTransactions());
  }, [dispatch]);





const user = useAppSelector(state => state.auth.users);

const { Income, Expense } = useAppSelector(selectTotals);
const { incomeMap, expenseMap } = useAppSelector(selectCategoryMaps);


  //Sort the top3 items based on amount
  const toTop3 = (map: Record<string, number>) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));

  const top3Income = toTop3(incomeMap);
  const top3Expense = toTop3(expenseMap);

  //Echarts Logic

  const chartOption = useMemo(() => {
    const categories = Array.from(new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)]));
    const incomeData = categories.map((cat) => incomeMap[cat] || 0);
    const expenseData = categories.map((cat) => expenseMap[cat] || 0);

    return {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { top: 0 },
      xAxis: { type: "category", data: categories, name: "Categories",nameLocation: "middle"   },
      yAxis: { type: "value", axisLabel: { formatter: "₹{value}" } ,  name: "Amount" ,nameLocation: "middle"},
      series: [
        { name: "Income", type: "bar", data: incomeData, itemStyle: { color: "#4caf50" } },
        { name: "Expense", type: "bar", data: expenseData, itemStyle: { color: "#f44336" } },
      ],
    };
  }, [incomeMap, expenseMap]);

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

      <Grid container justifyContent="center" mt={4}>
        <Grid size={{ xs: 12, md: 10 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category-wise Income vs Expense
              </Typography>

              <ReactECharts
                option={chartOption}
                style={{ height: 400, width: "100%" }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>

  )
}

export default Dashboard;