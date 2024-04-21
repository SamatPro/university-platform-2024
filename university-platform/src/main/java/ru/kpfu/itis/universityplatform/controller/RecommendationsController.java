package ru.kpfu.itis.universityplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.universityplatform.entity.Profile;
import ru.kpfu.itis.universityplatform.repository.ProfileRepository;
import ru.kpfu.itis.universityplatform.service.AntColonyService;

import java.util.List;

@RestController
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

}
