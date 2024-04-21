package ru.kpfu.itis.universityplatform.entity;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "jobs")
@Data
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String employer;

    @Column(nullable = false)
    private String position;

    @Column(length = 1024)
    private String description;

    @Column(nullable = false)
    private String location;

    @ManyToOne
    @JoinColumn(name = "posted_by")
    private User postedBy;

}