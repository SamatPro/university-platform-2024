package ru.kpfu.itis.universityplatform.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import ru.kpfu.itis.universityplatform.entity.Message;
import ru.kpfu.itis.universityplatform.service.MessageService;

import java.time.LocalDateTime;

@Controller
public class WebSocketController {

    private final MessageService messageService;

    public WebSocketController(MessageService messageService) {
        this.messageService = messageService;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Message handleMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        return messageService.saveMessage(message);
    }
}

