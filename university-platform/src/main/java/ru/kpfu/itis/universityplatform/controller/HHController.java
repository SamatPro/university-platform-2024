package ru.kpfu.itis.universityplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.universityplatform.service.HHService;

@RestController
public class HHController {

    @Autowired
    private HHService hhService;

    @GetMapping("/search")
    public String searchVacancies(@RequestParam String text) {
        return hhService.searchVacancies(text);
    }
}
