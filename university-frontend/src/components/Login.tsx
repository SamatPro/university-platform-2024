// Login.tsx
import React, { useState } from 'react';
import { useLoginMutation } from '../services/authApi';
import {useNavigate} from "react-router-dom";
import decodeToken from "../services/decodeToken";
import styles from "./HomePage.module.css";
import Header from "./Header";
import Footer from "./Footer";

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, { isLoading, isError }] = useLoginMutation();

    const handleLogin = async () => {
        try {
            const response = await login({ username, password }).unwrap();
            console.log(response)
            localStorage.setItem('token', response.token);
            console.log('Logged in successfully');
            const decoded = decodeToken(response.token)
            if (decoded && decoded.username) {
                localStorage.setItem('username', decoded.username);
                localStorage.setItem('currentUserId', String(decoded.userId));
                navigate(`/profile/${decoded.username}`);
            } else {
                console.error('Username is missing in the token');
                // Обработайте случай отсутствия username
            }
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    return (
        <div className={styles.homePage}>
            <Header/>
            <main className={styles.mainContent}>

                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    {isError && <p>Error logging in. Please try again.</p>}
                </div>

            </main>
            <Footer/>
        </div>

    );
}


export default Login;