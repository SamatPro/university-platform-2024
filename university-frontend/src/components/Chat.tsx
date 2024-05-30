import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useGetMessagesQuery, useSendMessageMutation } from '../services/apiService';
import styles from './Chat.module.css';

const Chat: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const currentUserId = localStorage.getItem('currentUser'); // Assuming you store current user's ID in localStorage
    const { data: messages, refetch } = useGetMessagesQuery(Number(userId));
    const [sendMessage] = useSendMessageMutation();
    const [newMessage, setNewMessage] = useState('');
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                console.log('Connected');
                client.subscribe(`/user/${currentUserId}/queue/messages`, (message) => {
                    if (message.body) {
                        refetch();
                    }
                });
            },
        });
        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [refetch, currentUserId]);

    const handleSendMessage = () => {
        if (clientRef.current && newMessage.trim() !== '') {
            const message = {
                senderId: Number(currentUserId),
                receiverId: Number(userId),
                content: newMessage,
                timestamp: new Date().toISOString()
            };
            clientRef.current.publish({ destination: '/app/chat', body: JSON.stringify(message) });
            setNewMessage('');
        }
    };

    return (
        <div className={styles.chat}>
            <div className={styles.messages}>
                {messages?.map((message, index) => (
                    <div key={index} className={styles.message}>
                        <strong>{message.sender.username}:</strong> {message.content}
                    </div>
                ))}
            </div>
            <div className={styles.inputArea}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
