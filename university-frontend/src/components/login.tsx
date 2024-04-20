import React, {useState} from 'react';
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const {data} = await axios.post('/api/auth/login', {username, password});
            localStorage.setItem('token', data.token);
            console.log('Logged in successfully');
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    return (
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
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
