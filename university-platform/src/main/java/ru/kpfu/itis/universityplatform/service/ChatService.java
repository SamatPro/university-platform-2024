package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.universityplatform.entity.ChatGroup;
import ru.kpfu.itis.universityplatform.repository.ChatGroupRepository;

@Service
public class ChatService {

    @Autowired
    private ChatGroupRepository chatGroupRepository;

    public ChatGroup createGroup(ChatGroup chatGroup) {
        return chatGroupRepository.save(chatGroup);
    }

    public ChatGroup getGroup(Long id) {
        return chatGroupRepository.findById(id).orElseThrow(() -> new RuntimeException("Group not found"));
    }
}