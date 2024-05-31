package ru.kpfu.itis.universityplatform.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.ToString;

import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@ToString(exclude = {"profile"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
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
