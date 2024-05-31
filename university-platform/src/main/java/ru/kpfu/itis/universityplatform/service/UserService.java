package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.itis.universityplatform.entity.GraphConnection;
import ru.kpfu.itis.universityplatform.entity.Profile;
import ru.kpfu.itis.universityplatform.entity.User;
import ru.kpfu.itis.universityplatform.repository.GraphConnectionRepository;
import ru.kpfu.itis.universityplatform.repository.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GraphConnectionRepository graphConnectionRepository;

    private final Path rootLocation = Paths.get("C:/uploads");

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getFriends(Long userId) {
        List<GraphConnection> connections = graphConnectionRepository.findByUserFromIdOrUserToId(userId, userId);
        Set<Long> friendIds = new HashSet<>();
        for (GraphConnection connection : connections) {
            if (connection.getUserFrom().getId().equals(userId)) {
                friendIds.add(connection.getUserTo().getId());
            } else {
                friendIds.add(connection.getUserFrom().getId());
            }
        }
        return userRepository.findAllById(friendIds);
    }

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void saveAvatar(String username, MultipartFile file) throws IOException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Profile profile = user.getProfile();

        if (!Files.exists(rootLocation)) {
            Files.createDirectories(rootLocation);
        }

        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path destinationFile = this.rootLocation.resolve(Paths.get(filename)).normalize().toAbsolutePath();
        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile);
        }

        profile.setAvatarFilename(filename);
        userRepository.save(user);
    }
}
