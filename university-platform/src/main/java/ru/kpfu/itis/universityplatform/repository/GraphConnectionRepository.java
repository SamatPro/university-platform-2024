package ru.kpfu.itis.universityplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.itis.universityplatform.entity.GraphConnection;

public interface GraphConnectionRepository extends JpaRepository<GraphConnection, Long> {
    boolean existsByUserFromIdAndUserToId(Long userFromId, Long userToId);

}

