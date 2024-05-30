import React from 'react';
import { useGetUsersQuery } from '../services/apiService';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styles from './NetworkPage.module.css';

const NetworkPage: React.FC = () => {
    const { data: users, error, isLoading } = useGetUsersQuery();

    const currentUserId = localStorage.getItem('currentUserId');

    const handleAddFriend = async (userId: number) => {
        try {
            const response = await fetch(` http://localhost:8080/api/friends/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId1: currentUserId, userId2: userId }),
            });

            if (response.ok) {
                // Обновить UI или отобразить сообщение об успехе
                alert('Friend request sent successfully');
            } else {
                throw new Error('Failed to send friend request');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending friend request');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users: {error.toString()}</div>;

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1>Сеть</h1>
                <ul className={styles.userList}>
                    {users?.map(user => (
                        <li key={user.id} className={styles.userItem}>
                            {user.profile ? (
                                <>
                                    <Link to={`/profile/${user.username}`}>
                                        {user.profile.firstName} {user.profile.lastName}
                                    </Link>
                                    <Link to={`/chat/${user.id}`} className={styles.messageButton}>
                                        Написать сообщение
                                    </Link>
                                    <button
                                        onClick={() => handleAddFriend(user.id)}
                                        className={styles.addFriendButton}
                                    >
                                        Добавить в друзья
                                    </button>
                                </>
                            ) : (
                                <span>{user.username} (Profile not available)</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <Footer />
        </div>
    );
};

export default NetworkPage;
