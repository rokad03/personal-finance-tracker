import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CategoryListing } from "../../Types/types";

type Props = {
  title: string;
  data?: CategoryListing[];
  emptyText?: string;
};

export default function TopCategoryTable({
  title,
  data = [],
  emptyText = "No data available",
}: Props) {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Typography
        variant="h6"
        sx={{
          p: 2,
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        {title}
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>
              Category
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: "bold" }}
            >
              Amount (₹)
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={2}
                align="center"
                sx={{ py: 3 }}
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>{row.category}</TableCell>
                <TableCell align="right">
                  {row.amount}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
