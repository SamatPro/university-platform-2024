import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import './Header.css';
import styles from './Header.module.css';
import {useGetProfileByUsernameQuery, useUpdateProfileMutation} from "../services/apiService";
import decodeToken from "../services/decodeToken";

const Header: React.FC = () => {

    const [username, setUsername] = useState("");


    const token = localStorage.getItem('token');
    useEffect(() => {
        const decoded = decodeToken(token || '')
        if (decoded && decoded.username) {
            setUsername(decoded.username)
        } else {
            console.error('Username is missing in the token');
        }
    }, []);


    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">Универ</Link>
                <nav className="navigation">
                    <ul>
                        {!token && <li><Link to={`/login`}>Вход</Link></li>}
                        {token && <li><Link to={`/profile/${username}`}>Профиль</Link></li>}
                        {token && <li><Link to="/network">Сеть</Link></li>}
                        {token && <li><Link to="/chat">Сообщения</Link></li>}
                        {token && <li><Link to="/notifications">Уведомления</Link></li>}
                        {token && <li><Link to="/friends">Друзья</Link></li>}
                        {token && <li><Link to="/mentor-recommendations">Рекомендации менторов</Link></li>}
                        {token && <li><Link to="/matchmaking">Знакомства</Link></li>}

                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;