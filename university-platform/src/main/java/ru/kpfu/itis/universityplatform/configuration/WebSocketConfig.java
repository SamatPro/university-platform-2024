package ru.kpfu.itis.universityplatform.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Регистрация endpoint'а, который клиенты будут использовать для подключения к WebSocket серверу
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Настройка простого брокера сообщений, который будет отправлять сообщения обратно клиенту на указанные destination-пути
        registry.enableSimpleBroker("/topic");
        // Указываем префикс для всех destination-путей, к которым будут направляться сообщения от клиентов
        registry.setApplicationDestinationPrefixes("/app");
    }
}
