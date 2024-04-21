package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kpfu.itis.universityplatform.entity.GraphConnection;
import ru.kpfu.itis.universityplatform.repository.GraphConnectionRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class AntColonyService {

    private final GraphConnectionRepository graphConnectionRepository;

    private AntColonyOptimization antColonyOptimization;

    @Autowired
    public AntColonyService(GraphConnectionRepository graphConnectionRepository) {
        this.graphConnectionRepository = graphConnectionRepository;
        initializeAntColony();
    }

    @Transactional(readOnly = true)
    public void initializeAntColony() {
        List<GraphConnection> connections = graphConnectionRepository.findAll();
        double[][] graph = buildGraphMatrix(connections);
        this.antColonyOptimization = new AntColonyOptimization(connections.size(), graph);
    }

    private double[][] buildGraphMatrix(List<GraphConnection> connections) {
        double[][] graph = new double[connections.size()][connections.size()];
        for (GraphConnection connection : connections) {
            int from = connection.getUserFrom().getId().intValue();
            int to = connection.getUserTo().getId().intValue();
            graph[from][to] = connection.getWeight();
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
            int from = connection.getUserFrom().getId().intValue();
            int to = connection.getUserTo().getId().intValue();
            connection.setPheromoneLevel(pheromones[from][to]);
            graphConnectionRepository.save(connection);
        }
    }

    public List<Long> recommendNewContacts(int userId, int numRecommendations) {
        int[] path = antColonyOptimization.simulateAnt(userId);
        List<Long> recommendations = new ArrayList<>();

        for (int user : path) {
            if (!isConnected(userId, user)) {
                recommendations.add((long) user);
                if (recommendations.size() == numRecommendations) break;
            }
        }
        return recommendations;
    }

    public boolean isConnected(long userId1, long userId2) {
        return graphConnectionRepository.existsByUserFromIdAndUserToId(userId1, userId2)
                || graphConnectionRepository.existsByUserFromIdAndUserToId(userId2, userId1);
    }


}
