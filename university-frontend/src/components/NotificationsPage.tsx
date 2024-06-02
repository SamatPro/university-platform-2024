import React from 'react';
import {
    useAcceptFriendRequestMutation,
    useDeclineFriendRequestMutation,
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation
} from '../services/apiService';
import styles from './NotificationsPage.module.css';
import Header from "./Header";
import Footer from "./Footer";
import Recommendations from "./Recommendations";


const NotificationsPage: React.FC = () => {
    const userId = Number(localStorage.getItem('currentUserId')); // Предполагается, что в токене есть ID пользователя

    const {data: notifications, error, isLoading} = useGetNotificationsQuery(userId);
    const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
    const [acceptFriendRequest] = useAcceptFriendRequestMutation();
    const [declineFriendRequest] = useDeclineFriendRequestMutation();

    const handleMarkAsRead = async (notificationId: number) => {
        await markNotificationAsRead(notificationId);
    };

    const handleAcceptFriendRequest = async (notificationId: number, senderId: number) => {
        await acceptFriendRequest({ notificationId, senderId, receiverId: userId });
    };

    const handleDeclineFriendRequest = async (notificationId: number) => {
        await declineFriendRequest(notificationId);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading notifications: {error.toString()}</div>;

    return (
        <div className="container">
            <Header/>
            <div className={styles.notificationsPage}>
                <div className={styles.mainContent}>
                    <h1>Уведомления</h1>
                    <ul className={styles.notificationList}>
                        {notifications?.map(notification => (
                            <li key={notification.id} className={styles.notificationItem}>
                                <span className={styles.notificationMessage}>{notification.message}</span>
                                {notification.type === 'FRIEND_REQUEST' ? (
                                    <>
                                        <button
                                            onClick={() => handleAcceptFriendRequest(notification.id, notification.senderId)}
                                            className={styles.button}
                                        >
                                            Принять
                                        </button>
                                        <button
                                            onClick={() => handleDeclineFriendRequest(notification.id)}
                                            className={styles.button}
                                        >
                                            Отклонить
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className={styles.button}
                                    >
                                        Отметить как прочитанное
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <Recommendations userId={userId} />
            </div>
            <Footer/>
        </div>
    );
};

export default NotificationsPage;
