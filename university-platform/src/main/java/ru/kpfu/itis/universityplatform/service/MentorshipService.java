package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.universityplatform.entity.User;
import ru.kpfu.itis.universityplatform.entity.UserRole;
import ru.kpfu.itis.universityplatform.repository.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MentorshipService {

    private final UserRepository userRepository;
    private final int POPULATION_SIZE = 10;
    private final int SCOUT_BEE_COUNT = 3;
    private final int BEST_SOURCE_COUNT = 3;
    private final int RECRUIT_COUNT = 5;

    @Autowired
    public MentorshipService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getMentorRecommendations(Long userId) {
        User currentUser = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
        if (currentUser.getRole() != UserRole.STUDENT) {
            throw new IllegalArgumentException("Only students can receive mentor recommendations");
        }
        return recommendMentors(userId);
    }

    private List<User> recommendMentors(Long userId) {
        List<User> mentors = userRepository.findByRole(UserRole.ALUMNI);

        if (mentors.size() <= POPULATION_SIZE) {
            return applyBeeAlgorithm(mentors, userId);
        } else {
            mentors = initializePopulation(mentors, Math.min(POPULATION_SIZE, mentors.size()));
            return applyBeeAlgorithm(mentors, userId);
        }
    }

    private List<User> initializePopulation(List<User> users, int populationSize) {
        Random random = new Random();
        List<User> population = new ArrayList<>();
        List<User> userList = new ArrayList<>(users);

        for (int i = 0; i < populationSize; i++) {
            int randomIndex = random.nextInt(userList.size());
            population.add(userList.get(randomIndex));
            userList.remove(randomIndex);
        }

        return population;
    }

    private List<User> applyBeeAlgorithm(List<User> users, Long userId) {
        List<User> recommendations = new ArrayList<>();

        // Step 1: Scout bees phase
        List<User> scoutBees = initializePopulation(new ArrayList<>(users), Math.min(SCOUT_BEE_COUNT, users.size()));

        // Step 2: Evaluate fitness
        List<User> bestSources = evaluateFitness(scoutBees, userId);

        // Step 3: Recruit bees and neighborhood search
        for (int i = 0; i < BEST_SOURCE_COUNT; i++) {
            List<User> neighborhood = initializePopulation(new ArrayList<>(users), Math.min(RECRUIT_COUNT, users.size()));
            bestSources.addAll(evaluateFitness(neighborhood, userId));
        }

        // Step 4: Select the best sources
        bestSources = bestSources.stream()
                .sorted(Comparator.comparingInt(u -> -getFitness(u, userId)))
                .limit(POPULATION_SIZE)
                .collect(Collectors.toList());

        // Remove the current user from the recommendations
        for (User user : bestSources) {
            if (!user.getId().equals(userId)) {
                recommendations.add(user);
            }
        }

        return recommendations;
    }

    private List<User> evaluateFitness(List<User> users, Long userId) {
        return users.stream()
                .sorted(Comparator.comparingInt(u -> -getFitness(u, userId)))
                .collect(Collectors.toList());
    }

    private int getFitness(User mentor, Long studentId) {
        User student = userRepository.findById(studentId).orElseThrow(() -> new NoSuchElementException("User not found"));
        Set<String> studentSkills = student.getProfile().getSkills();
        Set<String> mentorSkills = mentor.getProfile().getSkills();

        // Calculate the number of matching skills
        int matchingSkillsCount = 0;
        for (String skill : studentSkills) {
            if (mentorSkills.contains(skill)) {
                matchingSkillsCount++;
            }
        }

        // Return the fitness score based on matching skills
        return matchingSkillsCount;
    }
}
