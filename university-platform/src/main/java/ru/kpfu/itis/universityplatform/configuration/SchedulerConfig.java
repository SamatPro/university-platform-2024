package ru.kpfu.itis.universityplatform.configuration;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.universityplatform.service.AntColonyService;

@Component
public class SchedulerConfig {
    private final AntColonyService antColonyService;

    public SchedulerConfig(AntColonyService antColonyService) {
        this.antColonyService = antColonyService;
    }

    @Scheduled(cron = "0 0 1 * * ?") // Каждый день в 1:00 ночи
    public void runOptimizationTask() {
        antColonyService.optimizeNetwork();
    }
}
