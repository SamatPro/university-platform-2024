package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.itis.universityplatform.entity.GraphConnection;
import ru.kpfu.itis.universityplatform.entity.Notification;
import ru.kpfu.itis.universityplatform.entity.User;
import ru.kpfu.itis.universityplatform.repository.GraphConnectionRepository;
import ru.kpfu.itis.universityplatform.repository.NotificationRepository;
import ru.kpfu.itis.universityplatform.repository.UserRepository;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AntColonyService {

    private final GraphConnectionRepository graphConnectionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private AntColonyOptimization antColonyOptimization;
    private Map<Long, Integer> userIdToIndex;
    private List<Long> sortedUserIds;

    @Autowired
    public AntColonyService(GraphConnectionRepository graphConnectionRepository, UserRepository userRepository, NotificationService notificationService, NotificationRepository notificationRepository) {
        this.graphConnectionRepository = graphConnectionRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
        initializeAntColony();
    }

    @Transactional(readOnly = true)
    public void initializeAntColony() {
        List<GraphConnection> connections = graphConnectionRepository.findAll();
        Set<Long> userIds = connections.stream()
                .flatMap(c -> Stream.of(c.getUserFrom().getId(), c.getUserTo().getId()))
                .collect(Collectors.toSet());
        sortedUserIds = new ArrayList<>(userIds);
        Collections.sort(sortedUserIds);
        userIdToIndex = new HashMap<>();
        for (int i = 0; i < sortedUserIds.size(); i++) {
            userIdToIndex.put(sortedUserIds.get(i), i);
        }

        System.out.println("Total number of users: " + sortedUserIds.size());
        double[][] graph = buildGraphMatrix(connections, userIdToIndex, sortedUserIds.size());
        this.antColonyOptimization = new AntColonyOptimization(sortedUserIds.size(), graph);
    }

    private double[][] buildGraphMatrix(List<GraphConnection> connections, Map<Long, Integer> userIdToIndex, int numUsers) {
        double[][] graph = new double[numUsers][numUsers];
        for (GraphConnection connection : connections) {
            int from = userIdToIndex.get(connection.getUserFrom().getId());
            int to = userIdToIndex.get(connection.getUserTo().getId());
            graph[from][to] = connection.getWeight();
            System.out.println("Connection from: " + from + " to: " + to + " weight: " + connection.getWeight());
        }
        return graph;
    }

    public void optimizeNetwork() {
        antColonyOptimization.runOptimization();
        saveUpdatedPheromoneLevels();
    }

    @Transactional
    public void saveUpdatedPheromoneLevels() {
        double[][] pheromones = antColonyOptimization.getPheromones();
        List<GraphConnection> connections = graphConnectionRepository.findAll();

        for (GraphConnection connection : connections) {
            int from = userIdToIndex.get(connection.getUserFrom().getId());
            int to = userIdToIndex.get(connection.getUserTo().getId());
            connection.setPheromoneLevel(pheromones[from][to]);
            graphConnectionRepository.save(connection);
        }
    }

    public List<Long> recommendNewContacts(int userId, int numRecommendations) {
        if (!userIdToIndex.containsKey((long) userId)) {
            System.err.println("Invalid userId: " + userId);
            return new ArrayList<>();  // Возвращаем пустой список, если userId невалидный
        }

        System.out.println("Starting recommendation for userId: " + userId);
        int[] path = antColonyOptimization.simulateAnt(userIdToIndex.get((long) userId));
        System.out.println("Ant path: " + Arrays.toString(path));
        List<Long> recommendations = new ArrayList<>();
        Set<Long> existingFriends = getExistingFriends(userId);

        System.out.println("Existing friends: " + existingFriends);

        for (int index : path) {
            long recommendedUserId = sortedUserIds.get(index);
            System.out.println("Considering user: " + recommendedUserId);
            if (!isConnected(userId, recommendedUserId) && recommendedUserId != userId && !existingFriends.contains(recommendedUserId)) {
                recommendations.add(recommendedUserId);
                System.out.println("Added user to recommendations: " + recommendedUserId);
                if (recommendations.size() == numRecommendations) break;
            }
        }

        System.out.println("Recommendations: " + recommendations);
        return recommendations;
    }

    private Set<Long> getExistingFriends(long userId) {
        List<GraphConnection> connections = graphConnectionRepository.findByUserFromIdOrUserToId(userId, userId);
        Set<Long> friends = new HashSet<>();
        for (GraphConnection connection : connections) {
            if (connection.getUserFrom().getId() == userId) {
                friends.add(connection.getUserTo().getId());
            } else {
                friends.add(connection.getUserFrom().getId());
            }
        }
        return friends;
    }

    public boolean isConnected(long userId1, long userId2) {
        return graphConnectionRepository.existsByUserFromIdAndUserToId(userId1, userId2)
                || graphConnectionRepository.existsByUserFromIdAndUserToId(userId2, userId1);
    }

    @Transactional
    public void addFriend(long userId1, long userId2) {
        if (!isConnected(userId1, userId2)) {
            // Создание уведомления
            User user2 = userRepository.findById(userId2).orElseThrow();
            notificationService.createNotification(user2, "Пользователь " + userId1 + " хочет добавить вас в друзья.", Notification.NotificationType.FRIEND_REQUEST, userId1);
        }
    }

    @Transactional
    public void acceptFriendRequest(long notificationId, long senderId, long receiverId) {
        if (!isConnected(senderId, receiverId)) {
            GraphConnection connection1 = new GraphConnection();
            connection1.setUserFrom(userRepository.findById(senderId).orElseThrow());
            connection1.setUserTo(userRepository.findById(receiverId).orElseThrow());
            connection1.setWeight(1.0);
            connection1.setPheromoneLevel(0.1);
            graphConnectionRepository.save(connection1);

            GraphConnection connection2 = new GraphConnection();
            connection2.setUserFrom(userRepository.findById(receiverId).orElseThrow());
            connection2.setUserTo(userRepository.findById(senderId).orElseThrow());
            connection2.setWeight(1.0);
            connection2.setPheromoneLevel(0.1);
            graphConnectionRepository.save(connection2);

            // Обновление уведомления как прочитанного и обработанного
            Notification notification = notificationRepository.findById(notificationId).orElseThrow();
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void declineFriendRequest(long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
