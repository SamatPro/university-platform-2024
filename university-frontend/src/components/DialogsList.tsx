import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '../services/apiService';
import Recommendations from './Recommendations';
import styles from './DialogsList.module.css';

const DialogsList: React.FC = () => {
    const { data: users, error: usersError } = useGetUsersQuery();
    const currentUserId = Number(localStorage.getItem('currentUserId'));

    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    if (usersError) return <div>Error loading users: {usersError.toString()}</div>;

    const handleUserClick = (userId: number) => {
        setSelectedUserId(userId);
    };

    return (
        <div className={styles.container}>
            <Recommendations userId={currentUserId} />
            <div className={styles.dialogsListContainer}>
                <h1>Диалоги</h1>
                <ul className={styles.dialogsList}>
                    {users?.map(user => (
                        <li key={user.id} className={styles.dialog} onClick={() => handleUserClick(user.id)}>
                            <Link to={`/chat/${user.id}`}>
                                <div className={styles.avatar}>
                                    <img src={`http://localhost:8080/api/users/avatar/${user.profile.avatarFilename}`} alt="Avatar" />
                                </div>
                                <div className={styles.dialogInfo}>
                                    <div className={styles.dialogName}>{user.profile.firstName} {user.profile.lastName}</div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DialogsList;
