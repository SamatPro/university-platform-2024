package ru.kpfu.itis.universityplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kpfu.itis.universityplatform.entity.Profile;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUserUsername(String username);
}
