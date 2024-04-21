package ru.kpfu.itis.universityplatform.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "graph_connections")
@Data
public class GraphConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_from", referencedColumnName = "id")
    private User userFrom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_to", referencedColumnName = "id")
    private User userTo;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private Double pheromoneLevel;
}

