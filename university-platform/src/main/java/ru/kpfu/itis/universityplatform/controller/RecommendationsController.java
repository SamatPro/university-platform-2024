package ru.kpfu.itis.universityplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.universityplatform.entity.Profile;
import ru.kpfu.itis.universityplatform.repository.ProfileRepository;
import ru.kpfu.itis.universityplatform.service.AntColonyService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RecommendationsController {

    @Autowired
    private AntColonyService antColonyService;

    @Autowired
    private ProfileRepository profileRepository;


    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<List<Profile>> getRecommendations(@PathVariable int userId) {
        List<Long> recommendedUserIds = antColonyService.recommendNewContacts(userId, 5);
        List<Profile> recommendedProfiles = profileRepository.findAllById(recommendedUserIds);
        return ResponseEntity.ok(recommendedProfiles);
    }

    @PostMapping("/friends/add")
    public ResponseEntity<Void> addFriend(@RequestBody Map<String, Long> payload) {
        long userId1 = payload.get("userId1");
        long userId2 = payload.get("userId2");
        antColonyService.addFriend(userId1, userId2);
        return ResponseEntity.ok().build();
    }

}
