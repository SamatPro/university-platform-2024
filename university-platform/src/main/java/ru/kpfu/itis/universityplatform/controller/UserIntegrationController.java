package ru.kpfu.itis.universityplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.universityplatform.service.UserServiceIntegration;

@RestController
@RequestMapping("/api/sync-users")
public class UserIntegrationController {

    @Autowired
    private UserServiceIntegration userServiceIntegration;

    @GetMapping
    public ResponseEntity<String> syncUsers() {
        userServiceIntegration.syncUsers();
        return ResponseEntity.ok("Users synchronized successfully");
    }
}