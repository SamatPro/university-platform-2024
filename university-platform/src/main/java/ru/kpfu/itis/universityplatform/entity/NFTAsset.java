package ru.kpfu.itis.universityplatform.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "nft_assets")
@Data
public class NFTAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "tokenuri", nullable = false)
    private String tokenURI;

    @Column
    private String metadata;

    // getters and setters
}
