package ru.kpfu.itis.universityplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.universityplatform.entity.User;
import ru.kpfu.itis.universityplatform.service.MatchmakingService;

import java.util.List;

@RestController
@RequestMapping("/api/matchmaking")
public class MatchmakingController {

    @Autowired
    private MatchmakingService matchmakingService;

    @GetMapping("/recommendations/{userId}")
    public List<User> getMatchRecommendations(@PathVariable Long userId) {
        return matchmakingService.recommendMatches(userId);
    }
}

