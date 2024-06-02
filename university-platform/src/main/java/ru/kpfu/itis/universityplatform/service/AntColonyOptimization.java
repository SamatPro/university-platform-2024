package ru.kpfu.itis.universityplatform.service;

import lombok.Data;
import java.util.Arrays;

@Data
public class AntColonyOptimization {
    private double[][] pheromones;
    private double[][] graph;
    private int numUsers;
    private double evaporationRate = 0.5;
    private double pheromoneDeposit = 0.3;

    public AntColonyOptimization(int numUsers, double[][] graph) {
        this.numUsers = numUsers;
        this.graph = graph;
        this.pheromones = new double[numUsers][numUsers];
        initializePheromones();
    }

    private void initializePheromones() {
        for (int i = 0; i < numUsers; i++) {
            for (int j = 0; j < numUsers; j++) {
                pheromones[i][j] = 0.1;
            }
        }
    }

    public void runOptimization() {
        for (int i = 0; i < numUsers; i++) {
            int[] tour = simulateAnt(i);
            updatePheromones(tour);
        }
    }

    int[] simulateAnt(int startUser) {
        if (numUsers == 0 || graph.length == 0) {
            return new int[0];
        }

        int[] tour = new int[numUsers];
        boolean[] visited = new boolean[numUsers];
        Arrays.fill(visited, false);
        tour[0] = startUser;
        visited[startUser] = true;

        int current = startUser;
        for (int i = 1; i < numUsers; i++) {
            int next = chooseNext(current, visited);
            if (next == -1) {
                break;
            }
            tour[i] = next;
            visited[next] = true;
            current = next;
        }

        System.out.println("Generated tour for user " + startUser + ": " + Arrays.toString(tour));
        return tour;
    }

    private int chooseNext(int current, boolean[] visited) {
        double[] probabilities = calculateProbabilities(current, visited);
        return rouletteWheelSelection(probabilities);
    }

    private double[] calculateProbabilities(int current, boolean[] visited) {
        double[] probabilities = new double[numUsers];
        double sum = 0.0;

        for (int i = 0; i < numUsers; i++) {
            if (!visited[i]) {
                double pheromone = Math.pow(pheromones[current][i], 1.0);
                double heuristic = graph[current][i] != 0 ? Math.pow(1.0 / graph[current][i], 2.0) : 0;
                probabilities[i] = pheromone * heuristic;
                sum += probabilities[i];
            } else {
                probabilities[i] = 0;
            }
        }

        // Normalize probabilities
        for (int i = 0; i < numUsers; i++) {
            if (sum > 0) {
                probabilities[i] /= sum;
            } else {
                probabilities[i] = 0;
            }
        }

        System.out.println("Calculated probabilities for user " + current + ": " + Arrays.toString(probabilities));
        return probabilities;
    }

    private int rouletteWheelSelection(double[] probabilities) {
        double rand = Math.random();
        double cumulativeProbability = 0.0;

        for (int i = 0; i < numUsers; i++) {
            cumulativeProbability += probabilities[i];
            if (cumulativeProbability >= rand) {
                return i;
            }
        }

        return -1;
    }

    private void updatePheromones(int[] tour) {
        for (int i = 0; i < tour.length - 1; i++) {
            int from = tour[i];
            int to = tour[i + 1];
            if (from != -1 && to != -1) {

                pheromones[from][to] *= (1 - evaporationRate);

                pheromones[from][to] += pheromoneDeposit;
                System.out.println("Updated pheromones from " + from + " to " + to + ": " + pheromones[from][to]);
            }
        }
    }
}
