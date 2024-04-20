package ru.kpfu.itis.universityplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.itis.universityplatform.entity.ChatGroup;
import ru.kpfu.itis.universityplatform.entity.Message;

public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {
}
