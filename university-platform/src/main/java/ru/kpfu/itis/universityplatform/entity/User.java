package ru.kpfu.itis.universityplatform.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private Profile profile;

    @OneToMany(mappedBy = "postedBy")
    private List<Job> jobs;

    @OneToMany(mappedBy = "userFrom")
    @JsonIgnore
    private Set<GraphConnection> connectionsFrom;

    @OneToMany(mappedBy = "userTo")
    @JsonIgnore
    private Set<GraphConnection> connectionsTo;

    @OneToMany(mappedBy = "sender")
    @JsonBackReference
    private List<Message> sentMessages;

    @OneToMany(mappedBy = "receiver")
    @JsonBackReference
    private List<Message> receivedMessages;
}
