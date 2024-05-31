package ru.kpfu.itis.universityplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.universityplatform.entity.Notification;
import ru.kpfu.itis.universityplatform.service.NotificationService;
import ru.kpfu.itis.universityplatform.service.AntColonyService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AntColonyService antColonyService;

    @Autowired
    public NotificationController(NotificationService notificationService, AntColonyService antColonyService) {
        this.notificationService = notificationService;
        this.antColonyService = antColonyService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{notificationId}/accept")
    public ResponseEntity<Void> acceptFriendRequest(@PathVariable Long notificationId, @RequestParam Long senderId, @RequestParam Long receiverId) {
        antColonyService.acceptFriendRequest(notificationId, senderId, receiverId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{notificationId}/decline")
    public ResponseEntity<Void> declineFriendRequest(@PathVariable Long notificationId) {
        notificationService.declineFriendRequest(notificationId);
        return ResponseEntity.ok().build();
    }
}
