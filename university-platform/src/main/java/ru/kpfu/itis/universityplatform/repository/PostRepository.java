package ru.kpfu.itis.universityplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.itis.universityplatform.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
}
