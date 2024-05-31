import React from 'react';
import { useParams } from 'react-router-dom';
import DialogsList from './DialogsList';
import Chat from './Chat';
import Header from './Header';
import Footer from './Footer';
import styles from './ChatPage.module.css';
import '../App.css';


const ChatPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const currentUserId = Number(localStorage.getItem('currentUser'));

    return (
        <div className="container">
            <Header />
            <div className={styles.chatPage}>
                <div className={styles.dialogs}>
                    <DialogsList />
                </div>
                <div className={styles.chat}>
                    {userId ? <Chat /> : <div className={styles.placeholder}>Выберите диалог для начала общения</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChatPage;
