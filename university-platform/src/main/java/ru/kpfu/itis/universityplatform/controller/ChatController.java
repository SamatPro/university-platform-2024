package ru.kpfu.itis.universityplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.universityplatform.entity.ChatGroup;
import ru.kpfu.itis.universityplatform.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/groups")
    public ChatGroup createGroup(@RequestBody ChatGroup chatGroup) {
        return chatService.createGroup(chatGroup);
    }

    @GetMapping("/groups/{id}")
    public ResponseEntity<ChatGroup> getGroup(@PathVariable Long id) {
        try {
            ChatGroup group = chatService.getGroup(id);
            return ResponseEntity.ok(group);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
