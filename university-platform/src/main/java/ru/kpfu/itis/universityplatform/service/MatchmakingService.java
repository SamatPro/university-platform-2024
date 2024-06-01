package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.universityplatform.entity.User;
import ru.kpfu.itis.universityplatform.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchmakingService {

    @Autowired
    private UserRepository userRepository;

    public List<User> recommendMatches(Long userId) {
        List<User> allUsers = userRepository.findAll();
        User currentUser = userRepository.findById(userId).orElseThrow();

        allUsers = allUsers.stream()
                .filter(user -> !user.getId().equals(userId))
                .collect(Collectors.toList());

        return applySimulatedAnnealing(allUsers, currentUser);
    }

    private List<User> applySimulatedAnnealing(List<User> users, User currentUser) {
        int n = users.size();
        double temperature = 10000;
        double coolingRate = 0.003;
        List<User> currentSolution = new ArrayList<>(users);
        List<User> bestSolution = new ArrayList<>(users);

        while (temperature > 1) {
            List<User> newSolution = new ArrayList<>(currentSolution);

            int swapIndex1 = (int) (newSolution.size() * Math.random());
            int swapIndex2 = (int) (newSolution.size() * Math.random());

            User user1 = newSolution.get(swapIndex1);
            User user2 = newSolution.get(swapIndex2);

            newSolution.set(swapIndex2, user1);
            newSolution.set(swapIndex1, user2);

            int currentEnergy = calculateEnergy(currentSolution, currentUser);
            int neighbourEnergy = calculateEnergy(newSolution, currentUser);

            if (acceptanceProbability(currentEnergy, neighbourEnergy, temperature) > Math.random()) {
                currentSolution = new ArrayList<>(newSolution);
            }

            if (calculateEnergy(currentSolution, currentUser) < calculateEnergy(bestSolution, currentUser)) {
                bestSolution = new ArrayList<>(currentSolution);
            }

            temperature *= 1 - coolingRate;
        }

        return bestSolution.stream().limit(10).collect(Collectors.toList());
    }

    private int calculateEnergy(List<User> users, User currentUser) {
        int energy = 0;
        for (User user : users) {
            energy += getFitness(user, currentUser.getId());
        }
        return energy;
    }

    private double acceptanceProbability(int currentEnergy, int newEnergy, double temperature) {
        if (newEnergy < currentEnergy) {
            return 1.0;
        }
        return Math.exp((currentEnergy - newEnergy) / temperature);
    }

    private int getFitness(User user, Long userId) {
        User currentUser = userRepository.findById(userId).orElseThrow();

        int fitness = 0;

        fitness += calculateMatchScore(currentUser.getProfile().getSkills(), user.getProfile().getSkills());
        fitness += calculateMatchScore(currentUser.getProfile().getInterests(), user.getProfile().getInterests());
        fitness += calculateMatchScore(currentUser.getProfile().getFavoriteSubjects(), user.getProfile().getFavoriteSubjects());

        return fitness;
    }

    private int calculateMatchScore(Set<String> set1, Set<String> set2) {
        if (set1 == null || set2 == null) {
            return 0;
        }

        int matches = 0;
        for (String item : set1) {
            if (set2.contains(item)) {
                matches++;
            }
        }

        return matches;
    }
}
