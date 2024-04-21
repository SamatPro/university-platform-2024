package ru.kpfu.itis.universityplatform.entity;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonBackReference
    private Profile profile;

    @OneToMany(mappedBy = "postedBy")
    private List<Job> jobs;

    @OneToMany(mappedBy = "userFrom")
    private Set<GraphConnection> connectionsFrom;

    @OneToMany(mappedBy = "userTo")
    private Set<GraphConnection> connectionsTo;

}