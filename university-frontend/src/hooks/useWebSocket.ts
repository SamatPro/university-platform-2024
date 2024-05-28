import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useWebSocket = (endpoint: string, getToken: () => string | null) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(endpoint),
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${getToken()}`,
            },
            onConnect: () => {
                setIsConnected(true);
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
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, [endpoint, getToken]);

    return { stompClient, isConnected };
};
