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
  Box,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "./store/store";
import { loginError, loginRequest } from "./slice/loginSlice";

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { users, error, loading } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  //username and password filed validation

  const isUsernameInvalid =
    hasSubmitted && username.trim() === "";

  const isPasswordInvalid =
    hasSubmitted && password.trim() === "";

  const isFormValid =
    username.trim() !== "" && password.trim() !== "";

  //check if user present then navigate to dashboard

  useEffect(() => {
    if (users) navigate("/", { replace: true });
  }, [users, navigate]);

  //Submit action

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!isFormValid) {
      // Field-level errors only
      return;
    }

    // Clear old auth error before new request
    dispatch(loginError(""));
    dispatch(loginRequest({ username, password }));
  };

  

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Username"
              placeholder="username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={isUsernameInvalid}
              helperText={
                isUsernameInvalid ? "Username is required" : ""
              }
            />

            <TextField
              label="Password"
              placeholder="password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={isPasswordInvalid}
              helperText={
                isPasswordInvalid ? "Password is required" : ""
              }
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
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
