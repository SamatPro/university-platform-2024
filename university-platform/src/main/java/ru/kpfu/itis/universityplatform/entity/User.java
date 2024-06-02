package ru.kpfu.itis.universityplatform.entity;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @JsonManagedReference(value = "user-profile")
    private Profile profile;

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

    @OneToMany(mappedBy = "author")
    @JsonManagedReference(value = "post-author")
    private List<Post> posts;
}
