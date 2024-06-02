// src/components/NetworkPage.tsx
import React from 'react';
import {useGetUsersQuery} from '../services/apiService';
import {Link} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styles from './NetworkPage.module.css';
import '../App.css';
import Recommendations from './Recommendations';

const NetworkPage: React.FC = () => {
    const {data: users, error, isLoading} = useGetUsersQuery();

    const currentUserId = Number(localStorage.getItem('currentUserId'));

    const handleAddFriend = async (userId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/friends/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId1: currentUserId, userId2: userId}),
            });

            if (response.ok) {
                // Update UI or display success message
                // alert('Friend request sent successfully');
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
            <Header/>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>Сеть</h1>
                    <ul className={styles.userList}>
                        {users?.filter(user => user.id !== currentUserId).map(user => (
                            <li key={user.id} className={styles.userItem}>
                                {user.profile ? (
                                    <>
                                        <div className={styles.userInfo}>
                                            {user.profile.avatarFilename ? (
                                                <img
                                                    src={`http://localhost:8080/api/users/avatar/${user.profile.avatarFilename}`}
                                                    alt="Avatar"
                                                    className={styles.avatar}
                                                />
                                            ) : (
                                                <div className={styles.avatarPlaceholder}></div>
                                            )}
                                            <div className={styles.userDetails}>
                                                <Link to={`/profile/${user.username}`} className={styles.profileLink}>
                                                    {user.profile.firstName} {user.profile.lastName}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className={styles.buttonsContainer}>
                                            <Link to={`/chat/${user.id}`} className={styles.messageButton}>
                                                Написать сообщение
                                            </Link>
                                            <button
                                                onClick={() => handleAddFriend(user.id)}
                                                className={styles.addFriendButton}
                                            >
                                                Добавить в друзья
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <span>{user.username} (Profile not available)</span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <Recommendations userId={currentUserId}/>
                </div>
                <Footer/>
            </div>
        </div>
    );
};

export default NetworkPage;
