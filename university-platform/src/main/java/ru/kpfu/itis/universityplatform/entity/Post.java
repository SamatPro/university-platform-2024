package ru.kpfu.itis.universityplatform.entity;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name = "author_id")
    @JsonBackReference(value = "post-author")
    @JsonIgnore
    private User author;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    // getters and setters
}
