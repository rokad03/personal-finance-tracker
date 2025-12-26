import { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";

type UserLogin = {
    username: string,
    password: string
}
function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    async function checkUser() {
        const data = await fetch("https://dummyjson.com/users");
        const parsedData = await data.json();
        const users = parsedData.users;
        const user = users.find((user: UserLogin) => user.username === username && user.password === password);
        console.log(user)
        if (user) {
            const authorizeData = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    expiresInMins: 60,
                }),
            })
            const authorizeParsedData = await authorizeData.json();
            console.log("Authorize Data:", authorizeParsedData);
            return authorizeParsedData
        }
        return false;
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log(username, password);
        const user = await checkUser()
        console.log("User Found:", user);
        sessionStorage.setItem(user.accessToken, user.firstName);
        navigate('/dashboard');
        

        let data = sessionStorage.getItem("username");
        console.log("data from session storage", data);
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit} >
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

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
