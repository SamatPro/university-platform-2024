import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUniversity } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';
import decodeToken from "../services/decodeToken";

const Header: React.FC = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    useEffect(() => {
        const decoded = decodeToken(token || '');
        if (decoded && decoded.username) {
            setUsername(decoded.username);
        } else {
            console.error('Username is missing in the token');
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('currentUserId');
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link to="/" className={styles.logo}>
                    <FontAwesomeIcon icon={faUniversity} className={styles.logoIcon} /> Универ
                </Link>
                <nav className={styles.navigation}>
                    <ul>
                        {!token && <li><Link to={`/login`}>Вход</Link></li>}
                        {token && <li><Link to={`/profile/${username}`}>Профиль</Link></li>}
                        {token && <li><Link to="/posts">Публикации</Link></li>}
                        {token && <li><Link to="/network">Сеть</Link></li>}
                        {token && <li><Link to="/chat">Сообщения</Link></li>}
                        {token && <li><Link to="/notifications">Уведомления</Link></li>}
                        {token && <li><Link to="/friends">Друзья</Link></li>}
                        {token && <li><Link to="/mentor-recommendations">Рекомендации менторов</Link></li>}
                        {token && <li><Link to="/matchmaking">Знакомства</Link></li>}
                    </ul>
                </nav>
                {token && (
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        <FontAwesomeIcon icon={faSignOutAlt} className={styles.logoutIcon} />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
