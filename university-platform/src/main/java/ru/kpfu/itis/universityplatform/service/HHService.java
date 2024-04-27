package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class HHService {
    private final RestTemplate restTemplate;

    @Value("${hh.api.url}")
    private String apiUrl;

    @Value("${hh.api.key}")
    private String apiKey;

    public HHService() {
        this.restTemplate = new RestTemplate();
    }

    public String searchVacancies(String text) {
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl + "/vacancies")
                .queryParam("text", text)
                .queryParam("api_key", apiKey)
                .toUriString();

        return restTemplate.getForObject(url, String.class);
    }
}
