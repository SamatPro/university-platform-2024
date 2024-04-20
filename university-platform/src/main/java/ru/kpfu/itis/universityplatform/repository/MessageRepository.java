package ru.kpfu.itis.universityplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.itis.universityplatform.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
