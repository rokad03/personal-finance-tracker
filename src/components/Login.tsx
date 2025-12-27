import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from './hooks';
import { loginError, loginRequest } from "./slice/loginSlice";

function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { users, error } = useAppSelector((state) => state.auth)
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    useEffect(() => {
        if (users) navigate("/", { replace: true })
    }, [users, navigate])
    const handleClick = () => {
        if(username.length===0 || password.length===0){
          dispatch(loginError("username or password not exists"))
        }
        dispatch(loginRequest({ username, password }))
    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={(e) => (e.preventDefault())} >
                {error && <h5 style={{color:"red"}}>{error}</h5>}
                <h2 className={styles.title}>Login</h2>
                <input
                    type="username"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" onClick={handleClick}>Login</button>
            </form>
        </div>
    );
}

export default Login;


