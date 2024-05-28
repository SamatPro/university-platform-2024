import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import Header from './Header';
import Footer from './Footer';
import styles from './HomePage.module.css';

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
    const { stompClient, isConnected } = useWebSocket('http://localhost:8080/ws', () => localStorage.getItem('token'));

    useEffect(() => {
        if (stompClient) {
            stompClient.onConnect = () => {
                console.log("STOMP connection established.");
                stompClient.subscribe('/topic/messages', (msg) => {
                    setReceivedMessages(prevMessages => [...prevMessages, msg.body]);
                });
            };
        }
    }, [stompClient]);

    const sendMessage = () => {
        if (stompClient && isConnected && message) {
            try {
                stompClient.publish({
                    destination: '/app/chat',
                    body: JSON.stringify({
                        content: message,
                        sender: { id: 1 }, // Hardcoded sender ID, replace with dynamic user data
                        receiver: { id: 2 } // Hardcoded receiver ID, replace with dynamic user data
                    })
                });
                setMessage(''); // Clear only on successful send
            } catch (error) {
                console.error("Error sending message:", error);
            }
        } else {
            console.error("STOMP client is not connected.");
        }
    };

    return (
        <div className={styles.homePage}>
            <Header />
            <main className={styles.mainContent}>
                <div>
                    <ul>
                        {receivedMessages.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Chat;
