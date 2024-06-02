import React, { useState } from 'react';
import { useLoginMutation } from '../services/authApi';
import {useNavigate} from "react-router-dom";
import decodeToken from "../services/decodeToken";
import styles from "./Login.module.css"; // Изменено на новый файл стилей
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
            localStorage.setItem('token', response.token);
            const decoded = decodeToken(response.token)
            if (decoded && decoded.username) {
                localStorage.setItem('username', decoded.username);
                localStorage.setItem('currentUserId', String(decoded.userId));
                navigate(`/profile/${decoded.username}`);
            } else {
                console.error('Username is missing in the token');
            }
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    return (
        <div className={styles.loginPage}>
            <Header/>
            <main className={styles.mainContent}>
                <div className={styles.loginContainer}>
                    <h1>Вход</h1>
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={styles.input}
                    />
                    <button onClick={handleLogin} disabled={isLoading} className={styles.button}>
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                    {isError && <p className={styles.error}>Ошибка при входе. Попробуйте еще раз.</p>}
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Login;
