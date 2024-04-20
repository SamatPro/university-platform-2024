package ru.kpfu.itis.universityplatform.entity;

import javax.persistence.*;
import java.util.List;

@Entity
public class ChatGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToMany
    private List<User> members;
}
