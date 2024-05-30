package ru.kpfu.itis.universityplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.universityplatform.entity.Message;
import ru.kpfu.itis.universityplatform.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/{userId}")
    public List<Message> getMessagesByUser(@PathVariable Long userId) {
        return messageService.findMessagesByUser(userId);
    }

    @PostMapping
    public Message createMessage(@RequestParam Long senderId, @RequestParam Long receiverId, @RequestBody String content) {
        return messageService.saveMessage(senderId, receiverId, content);
    }
}
