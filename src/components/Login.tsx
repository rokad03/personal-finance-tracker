import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  Stack,
  Box
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "./hooks";
import { loginError, loginRequest } from "./slice/loginSlice";

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { users, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (users) navigate("/", { replace: true });
  }, [users, navigate]);

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length === 0 || password.length === 0) {
      dispatch(loginError("username or password not exists"));
      return;
    }

   
    dispatch(loginRequest({ username, password }));
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleClick}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              placeholder="username"   
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              placeholder="Password"   
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
            >
              Login  
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
