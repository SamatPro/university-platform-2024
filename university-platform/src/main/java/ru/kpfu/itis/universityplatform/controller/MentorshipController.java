package ru.kpfu.itis.universityplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.universityplatform.entity.User;
import ru.kpfu.itis.universityplatform.service.MentorshipService;

import java.util.List;

@RestController
@RequestMapping("/api/mentorship")
public class MentorshipController {

    private final MentorshipService mentorshipService;

    @Autowired
    public MentorshipController(MentorshipService mentorshipService) {
        this.mentorshipService = mentorshipService;
    }

    @GetMapping("/recommendations/{userId}")
    public List<User> getMentorRecommendations(@PathVariable Long userId) {
        return mentorshipService.getMentorRecommendations(userId);
    }
}
