package com.sanjana.writersattic.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // COMMENTS
    @OneToMany(
            mappedBy = "story",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    // LIKES (IMPORTANT FIX)
    @OneToMany(
            mappedBy = "story",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Like> likes = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User author;
}