package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.itis.universityplatform.entity.GraphConnection;
import ru.kpfu.itis.universityplatform.entity.User;
import ru.kpfu.itis.universityplatform.repository.GraphConnectionRepository;
import ru.kpfu.itis.universityplatform.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class AntColonyService {

    private final GraphConnectionRepository graphConnectionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private AntColonyOptimization antColonyOptimization;

    @Autowired
    public AntColonyService(GraphConnectionRepository graphConnectionRepository, UserRepository userRepository, NotificationService notificationService) {
        this.graphConnectionRepository = graphConnectionRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        initializeAntColony();
    }

    @Transactional(readOnly = true)
    public void initializeAntColony() {
        List<GraphConnection> connections = graphConnectionRepository.findAll();
        int numUsers = (int) connections.stream()
                .flatMap(c -> List.of(c.getUserFrom().getId(), c.getUserTo().getId()).stream())
                .distinct()
                .count();
        double[][] graph = buildGraphMatrix(connections, numUsers);
        this.antColonyOptimization = new AntColonyOptimization(numUsers, graph);
    }

    private double[][] buildGraphMatrix(List<GraphConnection> connections, int numUsers) {
        double[][] graph = new double[numUsers][numUsers];
        for (GraphConnection connection : connections) {
            int from = connection.getUserFrom().getId().intValue() - 1;
            int to = connection.getUserTo().getId().intValue() - 1;
            if (from < numUsers && to < numUsers) {
                graph[from][to] = connection.getWeight();
            } else {
                System.err.println("Index out of bounds: from=" + from + ", to=" + to + ", numUsers=" + numUsers);
            }
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
            int from = connection.getUserFrom().getId().intValue() - 1;
            int to = connection.getUserTo().getId().intValue() - 1;
            if (from < pheromones.length && to < pheromones[from].length) {
                connection.setPheromoneLevel(pheromones[from][to]);
                graphConnectionRepository.save(connection);
            } else {
                System.err.println("Index out of bounds while updating pheromones: from=" + from + ", to=" + to);
            }
        }
    }

    public List<Long> recommendNewContacts(int userId, int numRecommendations) {
        int[] path = antColonyOptimization.simulateAnt(userId - 1);
        List<Long> recommendations = new ArrayList<>();

        for (int user : path) {
            if (!isConnected(userId, user + 1)) {
                recommendations.add((long) user + 1);
                if (recommendations.size() == numRecommendations) break;
            }
        }
        return recommendations;
    }

    public boolean isConnected(long userId1, long userId2) {
        return graphConnectionRepository.existsByUserFromIdAndUserToId(userId1, userId2)
                || graphConnectionRepository.existsByUserFromIdAndUserToId(userId2, userId1);
    }

    @Transactional
    public void addFriend(long userId1, long userId2) {
        if (!isConnected(userId1, userId2)) {
            GraphConnection connection = new GraphConnection();
            connection.setUserFrom(userRepository.findById(userId1).orElseThrow());
            connection.setUserTo(userRepository.findById(userId2).orElseThrow());
            connection.setWeight(1.0);  // или другой начальный вес
            connection.setPheromoneLevel(0.1);  // начальное значение феромона
            graphConnectionRepository.save(connection);

            // Создание уведомления
            User user2 = userRepository.findById(userId2).orElseThrow();
            notificationService.createNotification(user2, "Пользователь " + userId1 + " хочет добавить вас в друзья.");
        }
    }
}
