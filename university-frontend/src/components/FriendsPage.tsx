// src/components/FriendsPage.tsx
import React from 'react';
import {useGetFriendsByUserIdQuery} from '../services/apiService';
import {Link} from 'react-router-dom';
import styles from './FriendsPage.module.css';
import Header from './Header';
import Footer from './Footer';
import Recommendations from './Recommendations';

const FriendsPage: React.FC = () => {
    const currentUserId = Number(localStorage.getItem('currentUserId'));

    const {data: friends, error, isLoading} = useGetFriendsByUserIdQuery(currentUserId);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading friends: {error.toString()}</div>;

    return (
        <div>
            <Header/>
            <div className={styles.container}>

                <h1>Друзья</h1>
                <ul className={styles.userList}>
                    {friends?.map(friend => (
                        <li key={friend.id} className={styles.userItem}>
                            <div className={styles.userInfo}>
                                {friend.profile.avatarFilename ? (
                                    <img
                                        src={`http://localhost:8080/api/users/avatar/${friend.profile.avatarFilename}`}
                                        alt="Avatar"
                                        className={styles.avatar}
                                    />
                                ) : (
                                    <div className={styles.avatarPlaceholder}></div>
                                )}
                                <Link to={`/profile/${friend.profile.user.username}`} className={styles.profileLink}>
                                    {friend.profile.firstName} {friend.profile.lastName}
                                </Link>
                            </div>
                            <Link to={`/chat/${friend.id}`} className={styles.messageButton}>Написать сообщение</Link>
                        </li>
                    ))}
                </ul>
                <Recommendations userId={currentUserId}/>
                <Footer/>
            </div>
        </div>

    );
};

export default FriendsPage;
