package ru.kpfu.itis.universityplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.universityplatform.entity.Profile;
import ru.kpfu.itis.universityplatform.repository.ProfileRepository;
import ru.kpfu.itis.universityplatform.service.ProfileService;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ProfileRepository profileRepository;

    @GetMapping("/{username}")
    public ResponseEntity<Profile> getProfileByUsername(@PathVariable String username) {
        return profileService.findProfileByUsername(username)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Profile createProfile(@RequestBody Profile profile) {
        return profileRepository.save(profile);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Profile> updateProfile(@PathVariable Long id, @RequestBody Profile profileDetails) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Profile not found for this id :: " + id));

        profile.setFirstName(profileDetails.getFirstName());
        profile.setLastName(profileDetails.getLastName());
        profile.setUniversity(profileDetails.getUniversity());
        profile.setGraduationYear(profileDetails.getGraduationYear());
        profile.setBio(profileDetails.getBio());
        profile.setSkills(profileDetails.getSkills());
        profile.setWorkplaces(profileDetails.getWorkplaces());
        profile.setInterests(profileDetails.getInterests());
        profile.setFavoriteSubjects(profileDetails.getFavoriteSubjects());

        Profile updatedProfile = profileRepository.save(profile);
        return ResponseEntity.ok(updatedProfile);
    }
}
