package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.kpfu.itis.universityplatform.entity.User;
import ru.kpfu.itis.universityplatform.repository.UserRepository;

@Service
public class UserServiceIntegration {

    @Autowired
    private UserRepository userRepository;

    private RestTemplate restTemplate = new RestTemplate();
    private final String externalApiUrl = "https://external.api/users";

    public void syncUsers() {
        User[] externalUsers = restTemplate.getForObject(externalApiUrl, User[].class);
        if (externalUsers != null) {
            for (User externalUser : externalUsers) {
                User existingUser = userRepository.findByEmail(externalUser.getEmail())
                        .orElse(userRepository.save(externalUser));
                updateUserData(existingUser, externalUser);
                userRepository.save(existingUser);
            }
        }
    }

    private void updateUserData(User existingUser, User externalUser) {
        existingUser.setUsername(externalUser.getUsername());
        // Дополнительные поля и логика обновления
    }

//    @Scheduled(cron = "0 0 * * * ?") // Каждый час
//    public void scheduleUserSync() {
//        syncUsers();
//    }
}
