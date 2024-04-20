package ru.kpfu.itis.universityplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.universityplatform.entity.Profile;
import ru.kpfu.itis.universityplatform.repository.ProfileRepository;

import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    public Optional<Profile> findProfileById(Long id) {
        return profileRepository.findById(id);
    }

    public Profile saveProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    public Optional<Profile> updateProfile(Long id, Profile profileDetails) {
        return profileRepository.findById(id)
                .map(profile -> {
                    profile.setFirstName(profileDetails.getFirstName());
                    profile.setLastName(profileDetails.getLastName());
                    profile.setUniversity(profileDetails.getUniversity());
                    profile.setGraduationYear(profileDetails.getGraduationYear());
                    profile.setBio(profileDetails.getBio());
                    return profileRepository.save(profile);
                });
    }
}
