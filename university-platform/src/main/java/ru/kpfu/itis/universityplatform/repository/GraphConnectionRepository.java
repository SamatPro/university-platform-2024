package ru.kpfu.itis.universityplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.itis.universityplatform.entity.GraphConnection;

import java.util.List;

public interface GraphConnectionRepository extends JpaRepository<GraphConnection, Long> {
    boolean existsByUserFromIdAndUserToId(Long userFromId, Long userToId);
    List<GraphConnection> findByUserFromIdOrUserToId(Long userFromId, Long userToId);

}

