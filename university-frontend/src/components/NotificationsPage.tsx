import React from 'react';
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from '../services/apiService';
import styles from './NotificationsPage.module.css';

const NotificationsPage: React.FC = () => {
    const { data: notifications, error, isLoading } = useGetNotificationsQuery();
    const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

    const handleMarkAsRead = async (notificationId: number) => {
        await markNotificationAsRead(notificationId);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading notifications: {error.toString()}</div>;

    return (
        <div className={styles.container}>
            <h1>Уведомления</h1>
            <ul className={styles.notificationList}>
                {notifications?.map(notification => (
                    <li key={notification.id} className={styles.notificationItem}>
                        <p>{notification.message}</p>
                        <button onClick={() => handleMarkAsRead(notification.id)}>Отметить как прочитанное</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsPage;
