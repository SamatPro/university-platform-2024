import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useWebSocket = (endpoint: string, getToken: () => string | null) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // const socket = new SockJS(endpoint);
        const client = new Client({
            webSocketFactory: () => new SockJS(endpoint),
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            onConnect: () => {
                setIsConnected(true);
                client.subscribe('/topic/messages', (message) => {
                    // Handle message reception here
                });
            },
            onStompError: (error) => {
                setIsConnected(false);
                console.error('STOMP Error:', error);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket Error:', error);
            },
            onWebSocketClose: (event) => {
                setIsConnected(false);
                if (event.code === 1006) {
                    console.error('WebSocket closed abnormally.');
                }
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [endpoint, getToken]);

    return { stompClient, isConnected };
};
